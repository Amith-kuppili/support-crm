from fastapi import FastAPI
from app.routes import tickets
from app.middleware.cors_middleware import add_cors_middleware
from app.utils.exceptions import add_exception_handlers
from app.config.settings import settings

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Customer Support CRM API",
    version="1.0.0"
)

# Add middleware
add_cors_middleware(app)

# Add exception handlers
add_exception_handlers(app)

# Include routers
app.include_router(tickets.router)

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "message": "Support CRM API is running"}

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    return {
        "message": "Welcome to the Support CRM API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }