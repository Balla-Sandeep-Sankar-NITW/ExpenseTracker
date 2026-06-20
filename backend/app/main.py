from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.db import create_tables , try_connecting_db
from app.api import expense
from app.api import analytics






app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Expense Tracker",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_tables()
try_connecting_db()

app.include_router(expense.router,prefix='/api/v1')
app.include_router(analytics.router,prefix='/api/v1')

@app.get("/")
def root():
    return {"app": settings.APP_NAME, "version": settings.APP_VERSION, "status": "running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}