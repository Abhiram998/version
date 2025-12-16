from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Nilakkal Parking Backend")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Backend is running"}

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/zones")
def get_zones():
    # dummy data for now
    return [
        {"id": "P1", "capacity": 200, "occupied": 120},
        {"id": "P2", "capacity": 150, "occupied": 90},
    ]
