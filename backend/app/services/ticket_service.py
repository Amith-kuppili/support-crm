from typing import List, Optional, Dict
from datetime import datetime
from app.services.nocodb_service import NocoDBService
from app.utils.ticket_id_generator import generate_unique_ticket_id
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketStats


class TicketService:
    def __init__(self):
        self.nocodb_service = NocoDBService()

    async def get_tickets(self, search: Optional[str] = None, status: Optional[str] = None) -> List[Dict]:
        """Get all tickets with optional search and status filter"""
        async with self.nocodb_service as nocodb:
            return await nocodb.get_tickets(search, status)

    async def get_ticket_by_id(self, ticket_id: str) -> Optional[Dict]:
        """Get a specific ticket by its ID"""
        async with self.nocodb_service as nocodb:
            return await nocodb.get_ticket_by_id(ticket_id)

    async def create_ticket(self, ticket_data: TicketCreate) -> Dict:
        """Create a new ticket"""
        async with self.nocodb_service as nocodb:
            # Generate unique ticket ID
            ticket_id = generate_unique_ticket_id()
            
            # Prepare ticket data for NocoDB
            nocodb_ticket_data = {
                "ticket_id": ticket_id,
                "customer_name": ticket_data.customer_name,
                "customer_email": ticket_data.customer_email,
                "subject": ticket_data.subject,
                "description": ticket_data.description,
                "status": "open",
                "priority": "medium",
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
                "initial_note": "Ticket created successfully."
            }
            
            # Create the ticket in NocoDB
            created_ticket = await nocodb.create_ticket(nocodb_ticket_data)
            return created_ticket

    async def update_ticket(self, ticket_id: str, update_data: TicketUpdate) -> Dict:
        """Update a ticket"""
        async with self.nocodb_service as nocodb:
            # Prepare update data for NocoDB
            nocodb_update_data = {}
            
            if update_data.status:
                nocodb_update_data["status"] = update_data.status.value
            
            if update_data.note_content:
                nocodb_update_data["note_content"] = update_data.note_content
                nocodb_update_data["note_author"] = update_data.note_author or "System"
            
            # Update the ticket in NocoDB
            updated_ticket = await nocodb.update_ticket(ticket_id, nocodb_update_data)
            return updated_ticket

    async def add_note_to_ticket(self, ticket_id: str, content: str, author: str) -> Dict:
        """Add a note to a ticket"""
        async with self.nocodb_service as nocodb:
            # First get the ticket to ensure it exists
            ticket = await nocodb.get_ticket_by_id(ticket_id)
            if not ticket:
                raise Exception(f"Ticket with ID {ticket_id} not found")
            
            # Prepare note data
            note_data = {
                "ticket_ref": ticket["ticket_id"],
                "content": content,
                "author": author,
                "created_at": datetime.utcnow().isoformat(),
                "type": "note"
            }
            
            # Create the note in NocoDB
            created_note = await nocodb.create_note(note_data)
            return created_note

    async def get_ticket_stats(self) -> TicketStats:
        """Get ticket statistics"""
        async with self.nocodb_service as nocodb:
            stats = await nocodb.get_ticket_stats()
            return stats