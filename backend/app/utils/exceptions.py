from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)


class TicketNotFoundException(Exception):
    """Raised when a ticket is not found"""
    def __init__(self, ticket_id: str):
        self.ticket_id = ticket_id
        self.message = f"Ticket with ID {ticket_id} not found"
        super().__init__(self.message)


class InvalidTicketDataException(Exception):
    """Raised when ticket data is invalid"""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class NocoDBConnectionException(Exception):
    """Raised when there's an issue connecting to NocoDB"""
    def __init__(self, message: str):
        self.message = f"NocoDB connection error: {message}"
        super().__init__(self.message)


async def ticket_not_found_exception_handler(request: Request, exc: TicketNotFoundException):
    """Handler for TicketNotFoundException"""
    logger.error(f"Ticket not found: {exc.ticket_id}")
    return JSONResponse(
        status_code=404,
        content={"detail": exc.message}
    )


async def invalid_ticket_data_exception_handler(request: Request, exc: InvalidTicketDataException):
    """Handler for InvalidTicketDataException"""
    logger.error(f"Invalid ticket data: {exc.message}")
    return JSONResponse(
        status_code=400,
        content={"detail": exc.message}
    )


async def nocodb_connection_exception_handler(request: Request, exc: NocoDBConnectionException):
    """Handler for NocoDBConnectionException"""
    logger.error(f"NocoDB connection error: {exc.message}")
    return JSONResponse(
        status_code=503,
        content={"detail": "Service temporarily unavailable. Please try again later."}
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """Handler for generic exceptions"""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )


def add_exception_handlers(app):
    """Add exception handlers to the FastAPI application"""
    app.add_exception_handler(TicketNotFoundException, ticket_not_found_exception_handler)
    app.add_exception_handler(InvalidTicketDataException, invalid_ticket_data_exception_handler)
    app.add_exception_handler(NocoDBConnectionException, nocodb_connection_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)