from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Nilakkal Parking Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"ok": True}

@app.get("/api/zones")
def get_zones():
    return [
        {"id": "P1", "capacity": 200, "occupied": 120},
        {"id": "P2", "capacity": 150, "occupied": 90},
    ]
