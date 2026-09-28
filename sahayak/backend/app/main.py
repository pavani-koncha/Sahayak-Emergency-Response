from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import database, models
from .routes import auth, profile, contacts, emergency, location

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Sahayak API",
    description="Emergency assistance when every second matters.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be restricted
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(contacts.router)
app.include_router(emergency.router)
app.include_router(location.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Sahayak API is running"}
