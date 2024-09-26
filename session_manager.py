from contextlib import contextmanager
from database import SessionFactory

@contextmanager
def session_scope():
    session = SessionFactory()
    
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
