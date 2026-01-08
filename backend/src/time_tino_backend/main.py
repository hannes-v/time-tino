from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import DateTime, create_engine, Column, Integer, String, func, ForeignKey
import sqlalchemy
from sqlalchemy.orm import sessionmaker, Session, relationship
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
    # Reference to tag by id
    tag_id = Column(Integer, ForeignKey("tags.id"), nullable=False, index=True)
    tag = relationship("Tag", back_populates="items")
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True, server_default=None)

    def get_duration(self):
        """Calculate the time duration between started_at and ended_at."""
        if self.ended_at and self.started_at:
            return self.ended_at - self.started_at
        return None


Base.metadata.create_all(bind=engine)

# Tag model
class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    items = relationship("Item", back_populates="tag")

# ensure tables exist in correct order
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ItemCreate(BaseModel):
    tag_id: int

class ItemUpdate(BaseModel):
    tag_id: int
    started_at: datetime
    ended_at: datetime | None = None

class ItemResponse(BaseModel):
    id: int
    tag_id: int
    started_at: datetime
    ended_at: datetime | None = None


class TagCreate(BaseModel):
    name: str


class TagResponse(BaseModel):
    id: int
    name: str

class tag():
    id: int
    name: str

# create new item
@app.post("/items/", response_model=ItemResponse)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    # ensure tag exists
    tag = db.query(Tag).filter(Tag.id == item.tag_id).first()
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    db_item = Item(tag_id=item.tag_id, started_at=datetime.now(timezone.utc))
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return ItemResponse(id=db_item.id, tag_id=db_item.tag_id, started_at=db_item.started_at, ended_at=db_item.ended_at)

# update item by id
@app.post("/items/{item_id}", response_model=ItemResponse)
async def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    # ensure tag exists
    tag = db.query(Tag).filter(Tag.id == item.tag_id).first()
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    db_item.tag_id = item.tag_id
    db_item.started_at = item.started_at
    db_item.ended_at = item.ended_at
    db.commit()
    db.refresh(db_item)
    return ItemResponse(id=db_item.id, tag_id=db_item.tag_id, started_at=db_item.started_at, ended_at=db_item.ended_at)


# get all items
@app.get("/items/", response_model=list[ItemResponse])
async def read_items(db: Session = Depends(get_db)):
    items = db.query(Item).order_by(Item.started_at.desc()).all()
    return [ItemResponse(id=i.id, tag_id=i.tag_id, started_at=i.started_at, ended_at=i.ended_at) for i in items]


# Tags endpoints
@app.get("/tags", response_model=list[TagResponse])
async def read_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).order_by(Tag.name).all()
    return [TagResponse(id=t.id, name=t.name) for t in tags]


@app.post("/tags", response_model=TagResponse)
async def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    existing = db.query(Tag).filter(Tag.name == tag.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tag already exists")
    db_tag = Tag(name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return TagResponse(id=db_tag.id, name=db_tag.name)


@app.delete("/tags/{tag_id}", status_code=204)
async def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if db_tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    # prevent deletion if items reference this tag
    linked = db.query(Item).filter(Item.tag_id == tag_id).first()
    if linked:
        raise HTTPException(status_code=400, detail="Tag is in use by items")
    db.delete(db_tag)
    db.commit()
    return None


@app.delete("/items/{item_id}", status_code=204)
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return None

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