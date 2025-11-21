from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from urllib.parse import urlparse, unquote
from fastapi.staticfiles import StaticFiles
import time, pyodbc, smtplib, json
import base64, re, os, requests
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

#Cache for popular page
POPULAR_CACHE = {"data": [], "timestamp": 0}
POPULAR_TTL = 600

#Cache for latest page
LATEST_CACHE = {"data": [], "timestamp": 0}
LATEST_TTL = 600

#Cache for movie page
MOVIE_CACHE = {"data": [], "timestamp": 0}
MOVIE_TTL = 600

#Cache for upcoming page
UPCOMING_CACHE = {"data": [], "timestamp": 0}
UPCOMING_TTL = 600

load_dotenv()
API_URL = os.getenv("ANIME4I_URL")
LUCIFER_URL = os.getenv("LUCIFER_URL")
SEATV_URL = os.getenv("SEATV_URL")
USER_AGENT = os.getenv("USER_AGENT")

#Validated the API
if not API_URL or not urlparse(API_URL).scheme:
    raise ValueError(f"Invalid API_URL in .env: {API_URL}")

#Validated the Lucifer API
if not LUCIFER_URL or not urlparse(LUCIFER_URL).scheme:
    raise ValueError(f"Invalid LUCIFER URL in .env: {LUCIFER_URL}")

#Validated the Seatv API
if not SEATV_URL or not urlparse(SEATV_URL).scheme:
    raise ValueError(f"Invalid SEATV URL in .env: {SEATV_URL}")

#Validated the User-Agent
if not USER_AGENT:
    raise ValueError("USER_AGENT is missing in .env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="images"), name="images")

@app.get("/api/anime/upcoming")
def get_upcoming_donghua():
    try:
        if time.time() - UPCOMING_CACHE["timestamp"] < UPCOMING_TTL:
            return {"count": len(UPCOMING_CACHE["data"]), "results": UPCOMING_CACHE["data"]}
        
        file_path = os.path.join("data", "upcoming.json")
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        allowed_types = {"ona"}
        movies = [
            item for item in data.get("data", [])
            if str(item.get("type", "")).strip().lower() in allowed_types
        ]
        
        UPCOMING_CACHE["data"] = movies
        UPCOMING_CACHE["timestamp"] = time.time()

        return {"count": len(movies), "data": movies}

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="movies.json not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON format in movies.json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")
            
@app.get("/api/anime/popular")
def get_popular_donghua():
    try:
        headers = {"User-Agent": USER_AGENT}
        
        if time.time() - POPULAR_CACHE["timestamp"] < POPULAR_TTL:
            return {"count": len(POPULAR_CACHE["data"]), "results": POPULAR_CACHE["data"]}
        
        res = requests.get(SEATV_URL, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to load API")
        
        soup = BeautifulSoup(res.text, "html.parser")
        popular_section = soup.select_one("div.listupd.popularslider")
        
        if not popular_section:
            raise HTTPException(status_code=404, detail="Failed To Fetch the api")
        
        items = popular_section.select("article.bs")
        results = []
        
        for item in items:
            link_tag = item.select_one("a.tip")
            if not link_tag:
                continue
            
            title = link_tag.get("title", "").strip()
            link = link_tag.get("href", "#").strip()
            
            ep_match = re.search(r"(Episode|Ep)\s*(\d+)", title, re.IGNORECASE)
            episode = ep_match.group(2) if ep_match else None
                
            if episode is None:
                ep_span = item.select_one("span.epx")
                if ep_span:
                    ep_match = re.search(r"\d+", ep_span.get_text(strip=True))
                    episode = ep_match.group(0) if ep_match else None
                                
            clean_title = re.sub(r"(Episode|Ep)\s*\d+", "", title, flags=re.IGNORECASE)
            clean_title = re.sub(r"\[.*?\]|\bSubtitle\b", "", clean_title, flags=re.IGNORECASE)
            clean_title = clean_title.strip()
            
            img_tag = item.select_one("img")
            image = (
                img_tag.get("data-srcset")
                or img_tag.get("data-src")
                or img_tag.get("src")
                or ""
            )
            
            type_tag = item.select_one("div.typez")
            donghua_type = type_tag.get_text(strip=True) if type_tag else "Unknown"
            
            results.append({
                "title": clean_title,
                "episode": episode,
                "type": donghua_type,
                "link": link,
                "image": image
            })
            
        POPULAR_CACHE["data"] = results
        POPULAR_CACHE["timestamp"] = time.time()
        
        return {"count": len(results), "results": results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraper Error: {str(e)}")

@app.get("/api/anime/latest")
def get_latest_donghua():
    try:
        headers = {"User-Agent": USER_AGENT}

        if time.time() - LATEST_CACHE["timestamp"] < LATEST_TTL:
            return {
                "count": len(LATEST_CACHE["data"]),
                "data": LATEST_CACHE["data"]
            }

        results = []
        MAX_PAGE = 12
        page = 1

        while page <= MAX_PAGE:
            url = f"{SEATV_URL}/page/{page}/" if page > 1 else SEATV_URL
            res = requests.get(url, headers=headers)
            if res.status_code != 200:
                break

            soup = BeautifulSoup(res.text, "html.parser")
            latest_section = soup.select_one("div.listupd.normal div.excstf")
            if not latest_section:
                break

            items = latest_section.select("article.bs")
            if not items:
                break

            for item in items:
                link_tag = item.select_one("a.tip")
                if not link_tag:
                    continue

                title = link_tag.get("title", "").strip()
                link = link_tag.get("href", "").strip()
                
                ep_match = re.search(r"(Episode|Ep)\s*(\d+)", title, re.IGNORECASE)
                episode = ep_match.group(2) if ep_match else None
                
                if episode is None:
                    ep_span = item.select_one("span.epx")
                    if ep_span:
                        ep_match = re.search(r"\d+", ep_span.get_text(strip=True))
                        episode = ep_match.group(0) if ep_match else None
                                
                clean_title = re.sub(r"(Episode|Ep)\s*\d+", "", title, flags=re.IGNORECASE)
                clean_title = re.sub(r"\[.*?\]|\bSubtitle\b", "", clean_title, flags=re.IGNORECASE)
                clean_title = clean_title.strip()
                
                img_tag = item.select_one("img")
                image = (
                    img_tag.get("data-srcset")
                    or img_tag.get("data-src")
                    or img_tag.get("src")
                    or ""
                )
                
                type_tag = item.select_one("div.typez")
                donghua_type = type_tag.get_text(strip=True) if type_tag else "Unknown"
                
                results.append({
                    "title": clean_title,
                    "episode": episode,
                    "type": donghua_type,
                    "link": link,
                    "image": image
                })

            page += 1
            time.sleep(0.3)

        # Save to cache
        LATEST_CACHE["data"] = results
        LATEST_CACHE["timestamp"] = time.time()

        return {
            "count": len(results),
            "data": results
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request Error: {str(e)}")

    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Scraper Error: {str(err)}")

@app.get("/api/anime/movies")
def get_movies_donghua():
    try:
        if time.time() - MOVIE_CACHE["timestamp"] < MOVIE_TTL:
            return {"count": len(MOVIE_CACHE["data"]), "data": MOVIE_CACHE["data"]}

        file_path = os.path.join("data", "movies.json")
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        allowed_types = {"movie", "ona", "special", "ova"}
        movies = [
            item for item in data.get("data", [])
            if str(item.get("type", "")).strip().lower() in allowed_types
        ]
        
        MOVIE_CACHE["data"] = movies
        MOVIE_CACHE["timestamp"] = time.time()

        return {"count": len(movies), "data": movies}

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="movies.json not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON format in movies.json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")
    
    # This is the movie api i get from lucifer donghua 
    # try:
    #     headers = {"User-Agent": USER_AGENT}
        
    #     if time.time() - MOVIE_CACHE["timestamp"] < MOVIE_TTL:
    #         return{
    #             "count": len(MOVIE_CACHE["data"]),
    #             "data": MOVIE_CACHE["data"]
    #         }
        
    #     res = requests.get(LUCIFER_URL, headers=headers)
    #     if res.status_code != 200:
    #         raise HTTPException(status_code=404, detail="Error Fetching Movie API")
        
    #     soup = BeautifulSoup(res.text, "html.parser")
    #     movie_section = soup.select_one("div.listupd.flex div.excstf")
    #     if not movie_section:
    #         raise HTTPException(status_code=404, detail="Failed To Fetch the api")
        
    #     items = movie_section.select("article.stylefor")
    #     movies_list = []
        
    #     for item in items:
    #         link_tag = item.select_one("a.tip")
    #         if not link_tag:
    #             continue
            
    #         title = link_tag.get("title", "").strip()
    #         link = link_tag.get("href", "#").strip()

    #         clean_title = re.sub(r"\s*Episode\s*\d+.*", "", title, flags=re.IGNORECASE).strip()
            
    #         img_tag = item.select_one("img")
    #         image = (
    #             img_tag.get("data-srcset")
    #             or img_tag.get("data-src")
    #             or img_tag.get("src")
    #             or ""
    #         )

    #         movies_list.append({
    #             "title": clean_title,
    #             "link": link,
    #             "image": image
    #         })
            
    #     POPULAR_CACHE["data"] = movies_list
    #     POPULAR_CACHE["timestamp"] = time.time()
        
    #     return {"count": len(movies_list), "results": movies_list}
    
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Scraper Error: {str(e)}")
        
    #     movies_list = []
    #     page = 1
        
    #     while True:
    #         url = f"{LUCIFER_URL}/page/{page}/" if page > 1 else LUCIFER_URL
    #         res = requests.get(url, headers=headers)
    #         if res.status_code != 200:
    #             break
            
    #         soup = BeautifulSoup(res.text, "html.parser")
    #         movie_section = soup.select_one(
    #             "div.listupd.flex div.excstf"
    #         )
            
    #         if not movie_section:
    #             break
            
    #         items = movie_section.select(
    #             "article.stylefor"
    #         )
    #         if not items:
    #             break
            
    #         for item in items:
    #             link_tag = item.select_one("a.tip")
    #             if not link_tag:
    #                 continue
                
    #             title = link_tag.get("title", "").strip()
    #             link = link_tag.get("href", "").strip()
                
    #             img_tag = item.select_one("img")
    #             image = (
    #                 img_tag.get("data-srcset")
    #                 or img_tag.get("data-src")
    #                 or img_tag.get("src")
    #                 or ""
    #             )
                
    #             clean_title = re.sub(
    #                 r'\s*Episode\s*\d+.*', '', title, flags=re.IGNORECASE
    #             ).strip()

    #             movies_list.append({
    #                 "title": clean_title,
    #                 "link": link,
    #                 "image": image
    #             })

    #         page += 1
    #         time.sleep(0.3)

    #     # Save to cache
    #     MOVIE_CACHE["data"] = movies_list
    #     MOVIE_CACHE["timestamp"] = time.time()

    #     return {
    #         "count": len(movies_list),
    #         "data": movies_list
    #     }

    # except requests.exceptions.RequestException as e:
    #     raise HTTPException(status_code=500, detail=f"Request Error: {str(e)}")

    # except Exception as err:
    #     raise HTTPException(status_code=500, detail=f"Scraper Error: {str(err)}")