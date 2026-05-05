from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import map_data, predictions, models
from ml.trainer import train_all_models

app = FastAPI(title="Noida Energy Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://127.0.0.1:5173", 
        "http://127.0.0.1:5174",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(map_data.router)
app.include_router(predictions.router)
app.include_router(models.router)

@app.on_event("startup")
def startup_event():
    print("Training models on startup...")
    train_all_models()

@app.get("/")
def read_root():
    return {"status": "ok", "version": "1.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
