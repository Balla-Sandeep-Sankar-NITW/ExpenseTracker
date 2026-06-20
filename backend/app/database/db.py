from app.config import settings
from sqlalchemy import create_engine , text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,        # Reconnect if connection dropped
    pool_size=5,               # Keep RAM low
    max_overflow=10,
    pool_recycle=300,          # Recycle connections every 5 min
)

SessionLocal = sessionmaker(bind=engine,autoflush=False)

Base = declarative_base()


def get_db():
    
    db = SessionLocal()
    try :
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)

def try_connecting_db():

    try:
        with engine.connect() as cnn :
            cnn.execute(text("SELECT 1"))
            print("✅ Neon PostgreSQL connected")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
