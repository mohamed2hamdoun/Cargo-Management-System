from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, scoped_session
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:123456789@localhost:5432/shipping_db",
)

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import inside the function to avoid circular import at module load time
    from app import models  # noqa: F401

    Base.metadata.create_all(bind=engine)