from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from urllib.parse import urlparse, unquote
from fastapi.staticfiles import StaticFiles
import time, pyodbc, smtplib
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

load_dotenv()
API_URL = os.getenv("LUCIFER_URL")
USER_AGENT = os.getenv("USER_AGENT")

#Validated the API
if not API_URL or not urlparse(API_URL).scheme:
    raise ValueError(f"Invalid API_URL in .env: {API_URL}")

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

@app.get("/api/anime/popular")
def get_popular_donghua():
    try:
        headers = {"User-Agent": USER_AGENT}
        
        if time.time() - POPULAR_CACHE["timestamp"] < POPULAR_TTL:
            return {"count": len(POPULAR_CACHE["data"]), "results": POPULAR_CACHE["data"]}
        
        res = requests.get(API_URL, headers=headers)
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
            
            ep_match = re.search(r"Episode\s*(\d+)", title, re.IGNORECASE)
            episode = ep_match.group(1) if ep_match else None
            
            clean_title = re.sub(r"\s*Episode\s*\d+.*", "", title, flags=re.IGNORECASE).strip()
            
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

        donghua_list = []
        page = 1

        while True:
            url = f"{API_URL}/page/{page}/" if page > 1 else API_URL
            res = requests.get(url, headers=headers)
            if res.status_code != 200:
                break

            soup = BeautifulSoup(res.text, "html.parser")
            latest_section = soup.select_one(
                "div.listupd.normal div.excstf"
            )
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

                ep_match = re.search(r'Episode\s*(\d+)', title, re.IGNORECASE)
                episode = ep_match.group(1) if ep_match else None

                clean_title = re.sub(
                    r'\s*Episode\s*\d+.*', '', title, flags=re.IGNORECASE
                ).strip()

                img_tag = item.select_one("img")
                image = (
                    img_tag.get("data-srcset")
                    or img_tag.get("data-src")
                    or img_tag.get("src")
                    or ""
                )

                type_tag = item.select_one("div.typez")
                donghua_type = type_tag.get_text(strip=True) if type_tag else "Unknown"
                
                donghua_list.append({
                    "title": clean_title,
                    "episode": episode,
                    "type": donghua_type,
                    "link": link,
                    "image": image
                })

            page += 1
            time.sleep(0.3)

        # Save to cache
        LATEST_CACHE["data"] = donghua_list
        LATEST_CACHE["timestamp"] = time.time()

        return {
            "count": len(donghua_list),
            "data": donghua_list
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request Error: {str(e)}")

    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Scraper Error: {str(err)}")


