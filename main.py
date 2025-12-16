from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="Nilakkal Parking Backend")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # same origin now, safe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- API ROUTES ----------------
@app.get("/api/health")
def health():
    return {"ok": True}

@app.get("/api/zones")
def get_zones():
    return [
        {"id": "P1", "capacity": 200, "occupied": 120},
        {"id": "P2", "capacity": 150, "occupied": 90},
    ]

# ---------------- FRONTEND SERVING ----------------
FRONTEND_DIR = "dist/public"

if os.path.exists(FRONTEND_DIR):

    # Serve static assets (JS, CSS, images)
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")),
        name="assets",
    )

    # Serve React app (index.html) for all routes
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

else:
    @app.get("/")
    def frontend_missing():
        return {"error": "Frontend not built. Run npm run build."}
