from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from urllib.parse import urlparse, unquote, urljoin
from fastapi.staticfiles import StaticFiles
import time, smtplib, json
import base64, re, os, requests
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import mysql.connector
from passlib.context import CryptContext
from jose import JWTError, jwt

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

#Cache for 2D page
TWOD_CACHE = {"data": [], "timestamp": 0}
TWOD_TTL = 600

#Cache for trending series
TRENDING_CACHE = {"data": [], "timestamp": 0}
TRENDING_TTL = 600

#Cache for slider series
SLIDER_CACHE = {"data": [], "timestamp": 0}
SLIDER_TTL = 600

#Cache for recommended series
RECOMMENDED_CACHE = {"data": [], "timestamp": 0}
RECOMMENDED_TTL = 600

#Cache for steaming method
STREAM_CACHE = {}
STREAM_TTL = 600

#Cache for episode
EPISODES_CACHE = {}
EPISODES_TTL = 600

#Cache for detail
DETAIL_CACHE = {}
DETAIL_TTL = 600

load_dotenv()
API_URL = os.getenv("ANIME4I_URL")
DONGHUASTREAM_URL = os.getenv("DONGHUASTREAM_URL")
SEATV_URL = os.getenv("SEATV_URL")
USER_AGENT = os.getenv("USER_AGENT")
BASE_URL = os.getenv("BASE_URL")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

# DB connection
def get_db():
    try:
        db = mysql.connector.connect(
            host=os.getenv("DB_SERVER"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PWD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT", 3306))
        )
        return db
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

#Validated the API
if not API_URL or not urlparse(API_URL).scheme:
    raise ValueError(f"Invalid API_URL in .env: {API_URL}")

#Validated the Lucifer API
if not DONGHUASTREAM_URL or not urlparse(DONGHUASTREAM_URL).scheme:
    raise ValueError(f"Invalid LUCIFER URL in .env: {DONGHUASTREAM_URL}")

#Validated the Seatv API
if not SEATV_URL or not urlparse(SEATV_URL).scheme:
    raise ValueError(f"Invalid SEATV URL in .env: {SEATV_URL}")

#Validated the base url
if not BASE_URL or not urlparse(BASE_URL).scheme:
    raise ValueError(f"Invalid BASE URL in .env: {BASE_URL}")

#Validated the User-Agent
if not USER_AGENT:
    raise ValueError("USER_AGENT is missing in .env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="images"), name="images")

#Pydantic Model
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class BookmarkCreate(BaseModel):
    user_id: str
    title: str
    link: str
    image: str

#Utiliti
def hash_password(password: str) -> str:
    truncated = password.encode("utf-8")[:72].decode("utf-8", errors="ignore")
    return pwd_context.hash(truncated)

def verify_password(plain_pass: str, hashed_pass: str) -> bool:
    truncated = plain_pass.encode("utf-8")[:72].decode("utf-8", errors="ignore")
    return pwd_context.verify(truncated, hashed_pass)

#Register Endpoint
@app.post("/api/register")
def register(user: UserRegister):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Check if email exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            raise HTTPException(status_code=400, detail="Email already registered")

        # Hash password safely
        hashed_pw = hash_password(user.password)
        cursor.execute(
            "INSERT INTO users(username, email, password) VALUES (%s, %s, %s)",
            (user.username, user.email, hashed_pw)
        )
        db.commit()
        cursor.close()
        db.close()

        return {"message": "User registered successfully!"}

    except Exception as e:
        # Catch everything and print the error
        print("REGISTER ERROR:", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Login endpoint
@app.post("/api/login")
def login(user: UserLogin):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, username, email, password FROM users WHERE email = %s", (user.email,)
    )
    db_user = cursor.fetchone()
    cursor.close()
    db.close()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {
        "message": "Login successful!",
        "user": {"id": db_user["id"], "username": db_user["username"], "email": db_user["email"]}
    }

#add bookmark to database
@app.post("/api/bookmark")
def add_bookmark(bookmark: BookmarkCreate):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute(
        "INSERT INTO tb_bookmarks (user_id, title, link, image) VALUE (%s, %s, %s, %s)",
        (bookmark.user_id, bookmark.title, bookmark.link, bookmark.image)
    )
    db.commit()
    cursor.close()
    db.close()
    
    return {"message": "Bookmark added successfully!"}
    
#get bookmark from database for front end
@app.get("/api/bookmarks/{user_id}")
def get_bookmarks(user_id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute(
        "SELECT * FROM tb_bookmarks WHERE user_id = %s", (user_id,)
    )
    
    results = cursor.fetchall()
    cursor.close()
    db.close()
    
    return {"count": len(results), "bookmarks": results}

@app.get("/api/anime/upcoming")
def get_upcoming_donghua():
    try:
        if time.time() - UPCOMING_CACHE["timestamp"] < UPCOMING_TTL:
            return {"count": len(UPCOMING_CACHE["data"]), "results": UPCOMING_CACHE["data"]}
        
        file_path = os.path.join("data", "upcoming.json")
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        upcoming_items = []
        for item in data.get("data", []):
            image_path = item.get("image", "")
            if image_path.startswith("/"):
                image_url = BASE_URL + image_path
            else:
                image_url = image_path
                
            upcoming_items.append({
                "title": item.get("title", ""),
                "chinese": item.get("chinese", ""),
                "status": item.get("status", ""),
                "type": item.get("type", ""),
                "genres": item.get("genres", ""),
                "studio": item.get("studio", ""),
                "duration": item.get("duration", ""),
                "description": item.get("description", ""),
                "link": item.get("link", ""),
                "image": image_url,
                "episode": item.get("episode", "Upcoming")
            })
        
        UPCOMING_CACHE["data"] = upcoming_items
        UPCOMING_CACHE["timestamp"] = time.time()

        return {"count": len(upcoming_items), "data": upcoming_items}

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
            return {
                "count": len(POPULAR_CACHE["data"]),
                "results": POPULAR_CACHE["data"]
            }

        res = requests.get(DONGHUASTREAM_URL, headers=headers)
        res.raise_for_status()

        soup = BeautifulSoup(res.text, "html.parser")

        hotseries_box = None
        for box in soup.select("div.bixbox"):
            if box.select_one("div.releases.hothome"):
                hotseries_box = box
                break

        if not hotseries_box:
            raise HTTPException(status_code=404, detail="Hot Series not found")

        items = hotseries_box.select("div.listupd article.bs")
        results = []

        for item in items:
            a = item.select_one("a.tip")
            if not a:
                continue

            title = a.get("title", "").strip()
            link = a.get("href", "").strip()

            # episode
            ep_match = re.search(r"(Episode|Ep)\s*(\d+)", title, re.I)
            episode = ep_match.group(2) if ep_match else None

            if not episode:
                ep_span = item.select_one("span.epx")
                if ep_span:
                    m = re.search(r"\d+", ep_span.text)
                    episode = m.group() if m else None

            # clean title
            clean_title = title
            clean_title = re.sub(r"(Episode|Ep)\s*\d+.*", "", clean_title, flags=re.I)
            clean_title = re.sub(
                r"(multiple\s*subtitles?|multi\s*subs?|subtitles?)",
                "",
                clean_title,
                flags=re.I
            )
            clean_title = re.sub(r"\[.*?\]", "", clean_title)
            clean_title = clean_title.strip()

            img = item.select_one("img")
            image = img.get("data-src") or img.get("src") if img else ""

            anime_type = item.select_one("div.typez")
            type = anime_type.text.strip() if anime_type else "Unknown"

            results.append({
                "title": clean_title,
                "episode": episode,
                "type": type,
                "link": link,
                "image": image
            })

        POPULAR_CACHE["data"] = results
        POPULAR_CACHE["timestamp"] = time.time()

        return {
            "count": len(results),
            "results": results
        }

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
        MAX_PAGE = 11
        page = 1

        while page <= MAX_PAGE:
            url = f"{DONGHUASTREAM_URL}/anime/?order=update&page={page}"
            res = requests.get(url, headers=headers)
            if res.status_code != 200:
                break

            soup = BeautifulSoup(res.text, "html.parser")

            items = soup.select("div.postbody div.listupd article.bs")
            if not items:
                break

            for item in items:
                a = item.select_one("a.tip")
                if not a:
                    continue

                title = a.get("title", "").strip()
                link = a.get("href", "").strip()

                status = item.select_one("span.epx")
                status = status.get_text(strip=True) if status else None

                img = item.select_one("img")
                image = img.get("data-src") or img.get("src") if img else ""

                anime_type = item.select_one("div.typez")
                anime_type = anime_type.get_text(strip=True) if anime_type else "Unknown"

                results.append({
                    "title": title,
                    "status": status,
                    "type": anime_type,
                    "link": link,
                    "image": image
                })

            page += 1
            time.sleep(0.5)

        LATEST_CACHE["data"] = results
        LATEST_CACHE["timestamp"] = time.time()

        return {
            "count": len(results),
            "data": results
        }

    except Exception:
        raise HTTPException(status_code=500, detail="Scraping Error")

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

@app.get("/api/anime/twod")
def get_twod_donghua():
    try:
        if time.time() - TWOD_CACHE["timestamp"] < TWOD_TTL:
            return {"count": len(TWOD_CACHE["data"]), "data": TWOD_CACHE["data"]}

        file_path = os.path.join("data", "twods.json")
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        allowed_types = {"movie", "ona", "special", "ova"}
        twods = [
            item for item in data.get("data", [])
            if str(item.get("type", "")).strip().lower() in allowed_types
        ]

        TWOD_CACHE["data"] = twods
        TWOD_CACHE["timestamp"] = time.time()

        return {"count": len(twods), "data": twods}

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="twods.json not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON format in twods.json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")
    
@app.get("/api/anime/recommended")
def get_recommended_series():
    try:
        headers = {"User-Agent": USER_AGENT}
        
        if time.time() - RECOMMENDED_CACHE["timestamp"] < RECOMMENDED_TTL:
            return {
                "count": len(RECOMMENDED_CACHE["data"]),
                "data": RECOMMENDED_CACHE["data"]
            }
        
        res = requests.get(SEATV_URL, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to load API")
        
        soup = BeautifulSoup(res.text, "html.parser")
        recommended_section = soup.select_one("div.bixbox div.listupd")
        
        if not recommended_section:
            raise HTTPException(status_code=404, detail="Failed To Fetch the api")
        
        items = recommended_section.select("article.bs")
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
        
        RECOMMENDED_CACHE["data"] = results
        RECOMMENDED_CACHE["timestamp"] = time.time()
        
        return {"count": len(results), "results": results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraper Error: {str(e)}")
        
@app.get("/api/anime/trending")
def get_trending_donghua():
    try:
        headers = {"User-Agent": USER_AGENT}
        
        if time.time() - TRENDING_CACHE["timestamp"] < TRENDING_TTL:
            return {
                "count": len(TRENDING_CACHE["data"]),
                "data": TRENDING_CACHE["data"]
            }

        res = requests.get(DONGHUASTREAM_URL, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to load API")
        
        soup = BeautifulSoup(res.text, "html.parser")
        trending_list = []
        
        for a in soup.select("div.trending div.tdb a"):
            title = a.select_one(".numb b")
            image_div = a.select_one(".imgxb")
            
            image_url = None
            if image_div and "style" in image_div.attrs:
                style = image_div["style"]
                image_url = style.split("url('")[1].split("')")[0]

            trending_list.append({
                "title": title.text.strip() if title else None,
                "url": a["href"],
                "image": image_url
            })
            
        TRENDING_CACHE["data"] = trending_list
        TRENDING_CACHE["timestamp"] = time.time()

        return {
            "count": len(trending_list),
            "data": trending_list
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraper Error: {str(e)}")
    
@app.get("/api/anime/slider")
def get_slider_donghua():
    try:
        headers = {"User-Agent": USER_AGENT}
        
        if time.time() - SLIDER_CACHE["timestamp"] < SLIDER_TTL:
            return {
                "count": len(SLIDER_CACHE["data"]),
                "data": SLIDER_CACHE["data"]
            }
        
        res = requests.get(DONGHUASTREAM_URL, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to load API")
        
        soup = BeautifulSoup(res.text, "html.parser")
        
        slides = soup.select("div.slide-item.full")
        results = []
        
        for slide in slides:
            title_a = slide.select_one(".info-left .ellipsis a")
            poster_img = slide.select_one(".poster img")
            bg_img = slide.select_one(".slide-bg img")

            rating = slide.select_one(".site-vote span span")
            release = slide.select_one(".release-year")

            genres = [
                g.text.strip()
                for g in slide.select(".extra-category a")
            ]

            summary = slide.select_one(".excerpt .story")
            status = slide.select_one(".cast .director")
            anime_type = slide.select_one(".cast .actor")

            results.append({
                "title": title_a.text.strip() if title_a else None,
                "url": title_a["href"] if title_a else None,
                "poster": poster_img["src"] if poster_img else None,
                "background": bg_img["src"] if bg_img else None,
                "rating": rating.text.strip() if rating else None,
                "release_date": release.text.strip() if release else None,
                "genres": genres,
                "summary": summary.text.strip() if summary else None,
                "status": status.text.replace("Status:", "").strip() if status else None,
                "type": anime_type.text.replace("Type:", "").strip() if anime_type else None,
            })

        SLIDER_CACHE["data"] = results
        SLIDER_CACHE["timestamp"] = time.time()

        return {
            "count": len(results),
            "data": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraper Error: {str(e)}")
    
@app.get("/api/anime/search")
def get_search(q: str = ""):
    try:
        latest = LATEST_CACHE.get("data", [])
        upcoming = UPCOMING_CACHE.get("data", [])
        movie = MOVIE_CACHE.get("data", [])
        
        def normalize_latest(item):
            return{
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "image": item.get("image", ""),
                "episode": item.get("episode", "")
            }
        
        def normalize_upcoming(item):
            return{
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "image": item.get("image", ""),
                "episode": item.get("episode", "Upcoming")
            }
        
        def normalize_movie(item):
            return{
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "image": item.get("image", ""),
                "episode": "Movie"
            }
        
        all_items = []
        all_items += [normalize_latest(i) for i in latest]
        all_items += [normalize_upcoming(i) for i in upcoming]
        all_items += [normalize_movie(i) for i in movie]

        if q.strip():
            q_lower = q.lower()
            all_items = [
                item for item in all_items
                if q_lower in item["title"].lower()
            ]
        
        return {"count": len(all_items), "results": all_items}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@app.get("/api/anime/detail")
def get_detail(url: str):
    try:
        headers = {"User-Agent": USER_AGENT}

        # Check cache first
        if url in DETAIL_CACHE and time.time() - DETAIL_CACHE[url]["ts"] < DETAIL_TTL:
            return DETAIL_CACHE[url]["data"]

        res = requests.get(url, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to fetch detail page")

        soup = BeautifulSoup(res.text, "html.parser")

        title_block = soup.select_one("div.lm")

        title = title_block.select_one("h1.entry-title").get_text(strip=True)
        episode_meta = title_block.select_one("meta[itemprop='episodeNumber']")
        episode = episode_meta.get("content") if episode_meta else None

        released_date = (
            title_block.select_one("span.updated").get_text(strip=True)
            if title_block.select_one("span.updated")
            else None
        )

        series_tag = title_block.select_one("span.year a")
        series_link = series_tag.get("href") if series_tag else None
        series_title = series_tag.get_text(strip=True) if series_tag else None

        info_box = soup.select_one("div.single-info.bixbox")

        # Image
        poster_tag = info_box.select_one("img")
        image = (
            poster_tag.get("data-src")
            or poster_tag.get("src")
            or None
        )

        # Donghua Name + Chinese Name
        main_title = info_box.select_one("h2[itemprop='partOfSeries']")
        donghua_name = main_title.get_text(strip=True) if main_title else None

        chinese_title = info_box.select_one("span.alter")
        chinese_name = chinese_title.get_text(strip=True) if chinese_title else None

        # Rating
        rating_wrapper = info_box.select_one("div.rating strong")
        rating = (
            rating_wrapper.get_text(strip=True).replace("Rating", "").strip()
            if rating_wrapper else None
        )

        info_items = info_box.select("div.spe span")
        details = {}

        for span in info_items:
            raw = span.get_text(" ", strip=True)

            if ":" in raw:
                key, value = raw.split(":", 1)
                key = key.strip().lower()
                details[key] = value.strip()

        genres = [
            g.get_text(strip=True)
            for g in info_box.select("div.genxed a")
        ]

        desc_tag = info_box.select_one("div.desc")
        description = (
            desc_tag.get_text(" ", strip=True)
            if desc_tag
            else None
        )

        related_section = soup.select_one("div.bixbox")
        related = []

        if related_section:
            rel_items = related_section.select("ul li a, article a")
            for item in rel_items:
                related.append({
                    "title": item.get("title") or item.get_text(strip=True),
                    "link": item.get("href")
                })

        result = {
            "title": title,
            "episode": episode,
            "release_date": released_date,
            "series_title": series_title,
            "series_link": series_link,
            "donghua_name": donghua_name,
            "chinese_name": chinese_name,
            "image": image,
            "rating": rating,
            "details": {
                "status": details.get("status"),
                "network": details.get("network"),
                "released": details.get("released"),
                "duration": details.get("duration"),
                "season": details.get("season"),
                "country": details.get("country"),
                "type": details.get("type"),
                "episodes": details.get("episodes"),
                "fansub": details.get("fansub"),
                "censor": details.get("censor"),
            },
            "genres": genres,
            "description": description,
            "related_episodes": related
        }

        DETAIL_CACHE[url] = {
            "data": result,
            "ts": time.time()
        }

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fetch detail error: {str(e)}")

@app.get("/api/anime/stream")
def get_streaming(url: str):
    try:
        headers = {"User-Agent": USER_AGENT}
        
        if url in STREAM_CACHE and time.time() - STREAM_CACHE[url]["ts"] < STREAM_TTL:
            return STREAM_CACHE[url]["data"]

        res = requests.get(url, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to fetch streaming page")

        soup = BeautifulSoup(res.text, "html.parser")
        
        iframe = soup.select_one("iframe")
        stream_url = None

        if iframe:
            stream_url = (
                iframe.get("data-src")
                or iframe.get("src")
                or None
            )
        if stream_url and stream_url.startswith("data:image"):
            try:
                encoded = stream_url.split(",", 1)[1]
                decoded = base64.b64decode(encoded).decode("utf-8")

                # Extract real URL inside the iframe HTML
                inner = BeautifulSoup(decoded, "html.parser").select_one("iframe")
                stream_url = (
                    inner.get("src")
                    or inner.get("data-src")
                    or None
                )
            except:
                pass
            
        if not stream_url:
            raise HTTPException(status_code=404, detail="No playable stream found")

        # Make full URL if relative
        if stream_url.startswith("//"):
            parsed = urlparse(url)
            stream_url = f"{parsed.scheme}:{stream_url}"
        elif stream_url.startswith("/"):
            stream_url = urljoin(url, stream_url)

        final_result = {
            "source": stream_url
        }

        STREAM_CACHE[url] = {
            "data": final_result,
            "ts": time.time()
        }

        return final_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stream fetch error: {str(e)}")

@app.get("/api/anime/episodes")
def get_episodes(url: str):
    try:
        headers = {"User-Agent": USER_AGENT}
        
        if url in EPISODES_CACHE and (time.time() - EPISODES_CACHE[url]["ts"] < EPISODES_TTL):
            return EPISODES_CACHE[url]["data"]

        res = requests.get(url, headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to fetch episode list page")

        soup = BeautifulSoup(res.text, "html.parser")

        episode_items = soup.select("li[data-id] a")
        if not episode_items:
            raise HTTPException(status_code=404, detail="Episode list not found")

        episodes = []

        for ep in episode_items:
            link = ep.get("href")
            title_block = ep.select_one("h3")
            title = title_block.get_text(strip=True) if title_block else ""

            ep_match = re.search(r"Episode\s*(\d+)", title, re.IGNORECASE)
            number = int(ep_match.group(1)) if ep_match else None

            # Thumbnail
            img_tag = ep.select_one("img")
            image = (
                img_tag.get("data-src")
                or img_tag.get("src")
                or ""
            )

            # Clean title
            clean_title = re.sub(r"\s*Episode\s*\d+.*", "", title, flags=re.IGNORECASE).strip()

            episodes.append({
                "episode_number": number,
                "title": clean_title,
                "raw_title": title,
                "link": link,
                "image": image
            })

        # Sort newest → oldest
        episodes = sorted(episodes, key=lambda x: x["episode_number"] or 0, reverse=True)

        result = {
            "count": len(episodes),
            "episodes": episodes
        }

        EPISODES_CACHE[url] = {
            "data": result,
            "ts": time.time()
        }

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Episode fetch error: {str(e)}")
