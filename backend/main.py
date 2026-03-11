from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(title="TrackMania 2020 Pro Guide API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "quiz_results.json"

def load_results():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {}

def save_results(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

class QuizResult(BaseModel):
    technique: str
    score: int
    total: int

class QuizResultResponse(BaseModel):
    technique: str
    score: int
    total: int
    percentage: float
    timestamp: Optional[str] = None

@app.get("/")
def root():
    return {"message": "TrackMania 2020 Pro Guide API", "version": "1.0.0"}

@app.post("/api/quiz/save")
def save_quiz_result(result: QuizResult):
    data = load_results()
    from datetime import datetime
    data[result.technique] = {
        "score": result.score,
        "total": result.total,
        "percentage": round((result.score / result.total) * 100, 1),
        "timestamp": datetime.now().isoformat()
    }
    save_results(data)
    return {"success": True, "technique": result.technique, "score": result.score, "total": result.total}

@app.get("/api/quiz/results")
def get_quiz_results():
    return load_results()

@app.delete("/api/quiz/results")
def clear_quiz_results():
    save_results({})
    return {"success": True, "message": "All results cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
