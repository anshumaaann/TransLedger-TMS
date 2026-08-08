from app.core.config import settings
from app.core.security import hash_password
from app.db.database import SessionLocal
from app.models.user import User


def create_initial_admin() -> None:
    if not settings.INITIAL_ADMIN_EMAIL or not settings.INITIAL_ADMIN_PASSWORD:
        raise RuntimeError("INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set before the application can start")
    if len(settings.INITIAL_ADMIN_PASSWORD) < 12 or settings.INITIAL_ADMIN_PASSWORD.startswith("replace-"):
        raise RuntimeError("INITIAL_ADMIN_PASSWORD must be a unique password of at least 12 characters")
    if len(settings.JWT_SECRET_KEY) < 32 or settings.JWT_SECRET_KEY.startswith("replace-"):
        raise RuntimeError("JWT_SECRET_KEY must be a unique random value of at least 32 characters")
    db = SessionLocal()
    try:
        email = settings.INITIAL_ADMIN_EMAIL.strip().lower()
        if not db.query(User).filter(User.email == email).first():
            db.add(User(
                email=email,
                full_name=settings.INITIAL_ADMIN_NAME.strip(),
                hashed_password=hash_password(settings.INITIAL_ADMIN_PASSWORD),
                role="admin",
            ))
            db.commit()
            print(f"Created initial administrator account: {email}")
    finally:
        db.close()


if __name__ == "__main__":
    create_initial_admin()
