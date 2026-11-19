from fastapi import APIRouter

router = APIRouter()


# /health is what Railway's healthcheck probes on this service; /api/health is
# the path the web app proxies, and the one `api.health()` uses when it runs
# server-side and talks to BACKEND_URL directly.
@router.get("/health")
@router.get("/api/health")
async def health_check():
    return {"status": "ok"}
