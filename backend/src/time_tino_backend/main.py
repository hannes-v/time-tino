from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import DateTime, create_engine, Column, Integer, String, func
import sqlalchemy
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timezone

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



current_file = Path(__file__).resolve()

# 2. Wir gehen 4 Ebenen hoch zum Projekt-Root
# 1: time_tino_backend, 2: src, 3: backend, 4: Projekt-Root
project_root = current_file.parent.parent.parent.parent

# 3. Den Pfad zum Angular-Build definieren
frontend_dir = project_root / "frontend" / "dist" / "time-tino" / "browser"


# DEBUG: Damit du im Terminal siehst, ob der Pfad stimmt
print(f"Suche Frontend in: {frontend_dir}")
if not frontend_dir.exists():
    print("WARNUNG: Der Pfad existiert nicht!")

# Hier definierst du die erlaubten Quellen
origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Erlaubt alle HTTP-Methoden (GET, POST, etc.)
    allow_headers=["*"], # Erlaubt alle Header
)

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = sqlalchemy.orm.declarative_base()

def getTimestamp():
    return str(func.strftime("%Y-%m-%d %H:%M:%S", func.now()))

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, index=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True, server_default=None)

    def get_duration(self):
        """Calculate the time duration between started_at and ended_at."""
        if self.ended_at and self.started_at:
            return self.ended_at - self.started_at
        return None


Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ItemCreate(BaseModel):
    tag: str

class ItemUpdate(BaseModel):
    tag: str
    started_at: datetime
    ended_at: datetime | None = None

class ItemResponse(BaseModel):
    id: int
    tag: str
    started_at: datetime
    ended_at: datetime | None = None

# create new item
@app.post("/items/", response_model=ItemResponse)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(tag=item.tag, started_at=datetime.now(timezone.utc))
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# update item by id
@app.post("/items/{item_id}", response_model=ItemResponse)
async def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.tag = item.tag
    db_item.started_at = item.started_at
    db_item.ended_at = item.ended_at
    db.commit()
    db.refresh(db_item)
    return db_item


# get all items
@app.get("/items/", response_model=list[ItemResponse])
async def read_items(db: Session = Depends(get_db)):
    items = db.query(Item).order_by(Item.started_at.desc()).all()
    return items

app.mount("/static", StaticFiles(directory=frontend_dir), name="static")


@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Wenn eine konkrete Datei im Ordner existiert (z.B. styles.css), schicke sie
    file_in_dist = frontend_dir / full_path
    if file_in_dist.is_file():
        return FileResponse(file_in_dist)
    
    # Ansonsten schicke immer die index.html (für Angular's Routing)
    return FileResponse(frontend_dir / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)