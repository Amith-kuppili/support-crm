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

origins = [
    "https://amith-support-crm.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
from app.routes import tickets
app.include_router(tickets.router, prefix="/api")

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
