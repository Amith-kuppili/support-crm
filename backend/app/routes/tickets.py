from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Optional
from app.services.ticket_service import TicketService
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse, TicketStats
from app.utils.exceptions import TicketNotFoundException, InvalidTicketDataException

router = APIRouter(prefix="/tickets", tags=["tickets"])
ticket_service = TicketService()


@router.get("/stats")
async def get_ticket_stats():
    """Get ticket statistics"""
    try:
        stats = await ticket_service.get_ticket_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ticket stats: {str(e)}")


@router.post("", status_code=201)
async def create_ticket(ticket_data: TicketCreate):
    """Create a new support ticket"""
    try:
        created_ticket = await ticket_service.create_ticket(ticket_data)
        return created_ticket
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create ticket: {str(e)}")


@router.get("")
async def list_tickets(
    search: Optional[str] = Query(None, description="Search across ticket fields"),
    status: Optional[str] = Query(None, description="Filter tickets by status")
):
    """List all tickets with optional search and status filter"""
    try:
        tickets = await ticket_service.get_tickets(search, status)
        return tickets
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tickets: {str(e)}")


@router.get("/{ticket_id}")
async def get_ticket(ticket_id: str = Path(..., description="Ticket ID")):
    """Get a specific ticket by ID"""
    try:
        ticket = await ticket_service.get_ticket_by_id(ticket_id)
        if not ticket:
            raise TicketNotFoundException(ticket_id)
        return ticket
    except TicketNotFoundException:
        raise HTTPException(status_code=404, detail=f"Ticket with ID {ticket_id} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ticket: {str(e)}")


@router.put("/{ticket_id}")
async def update_ticket(
    ticket_id: str = Path(..., description="Ticket ID"),
    update_data: TicketUpdate = None
):
    """Update ticket status and/or add a note"""
    try:
        # If no update data is provided, return the ticket as-is
        if not update_data:
            ticket = await ticket_service.get_ticket_by_id(ticket_id)
            if not ticket:
                raise TicketNotFoundException(ticket_id)
            return ticket
            
        updated_ticket = await ticket_service.update_ticket(ticket_id, update_data)
        if not updated_ticket:
            raise TicketNotFoundException(ticket_id)
        return updated_ticket
    except TicketNotFoundException:
        raise HTTPException(status_code=404, detail=f"Ticket with ID {ticket_id} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update ticket: {str(e)}")
