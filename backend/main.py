from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Text, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import openai
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.DEBUG)
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
    raise ValueError("OpenAI API key is not set. Please add it to the .env file.")

# Database setup
DATABASE_URL = "sqlite:///./notes.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)
Base = declarative_base()

# Database Model
class Note(Base):
    __tablename__ = "notes"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(String, index=True)
    notes = Column(Text)
    __table_args__ = (UniqueConstraint("name", "date", name="unique_name_date"),)

# Create database tables
Base.metadata.create_all(bind=engine)

# Request body models
class NoteRequest(BaseModel):
    session_type: str
    duration: str
    notes: str

class SaveNoteRequest(BaseModel):
    name: str
    date: str
    notes: str

class NoteResponse(BaseModel):
    name: str
    date: str
    notes: str

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.post("/generate-notes")
async def generate_notes(request: NoteRequest):
    # Default values if session details are not specified
    session_type = request.session_type or "not specified"
    duration = request.duration or "not specified"
    raw_notes = request.notes

    # Prompt for OpenAI
    prompt = f"""
    As a professional therapist, I need to convert raw session notes into well-written, professional, and consistent notes for documentation
    in a clinical writing style.

    The session details are as follows:
    - Duration: {duration}
    - Type: {session_type}

    The raw notes are:
    {raw_notes}

    Please provide a professional and concise summary of the session based on these details.
    """

    try:
        # Use ChatCompletion API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use the latest available GPT model
            messages=[
                {"role": "system", "content": "You are a helpful assistant for therapists."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=150,
            temperature=0.7,
        )
        result = response.choices[0].message["content"].strip()
        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")

@app.post("/save-notes", response_model=NoteResponse)
async def save_notes(request: SaveNoteRequest, db: Session = Depends(get_db)):
    existing_note = db.query(Note).filter(Note.name == request.name, Note.date == request.date).first()
    if existing_note:
        raise HTTPException(status_code=400, detail="A note with this name and date already exists.")

    new_note = Note(id= request.name + "_" + request.date,name=request.name, date=request.date, notes=request.notes)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@app.get("/get-notes", response_model=list[NoteResponse])
async def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()
