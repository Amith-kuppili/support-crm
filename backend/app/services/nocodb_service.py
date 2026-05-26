import httpx
from typing import Dict, List, Optional, Any
from datetime import datetime
from app.config.settings import settings
from app.schemas.ticket import TicketStatus, Priority, NoteType


class NocoDBService:
    def __init__(self):
        self.base_url = settings.NOCODB_BASE_URL.rstrip("/")
        self.api_key = settings.NOCODB_API_KEY
        self.project_id = settings.NOCODB_PROJECT_ID
        self.tickets_table_id = settings.NOCODB_TICKETS_TABLE_ID
        self.notes_table_id = settings.NOCODB_NOTES_TABLE_ID
        self.headers = {
            "xc-token": self.api_key,
            "Content-Type": "application/json"
        }
        self.client = self._create_client()

    def _create_client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            base_url=self.base_url,
            headers=self.headers,
            timeout=30.0
        )

    def _flatten_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(record, dict):
            return {}

        flat_record = dict(record)
        fields = flat_record.get("fields")
        if isinstance(fields, dict):
            flat_record = {**fields, **{k: v for k, v in flat_record.items() if k != "fields"}}

        id_fields = flat_record.get("id_fields")
        if isinstance(id_fields, dict):
            for key, value in id_fields.items():
                flat_record.setdefault(key, value)

        return flat_record

    def _extract_records(self, payload: Any) -> List[Dict[str, Any]]:
        if isinstance(payload, list):
            return [item for item in payload if isinstance(item, dict)]

        if isinstance(payload, dict):
            for key in ("records", "list", "data", "items", "rows"):
                records = payload.get(key)
                if isinstance(records, list):
                    return [item for item in records if isinstance(item, dict)]

            if any(key in payload for key in ("id", "Id", "ID")):
                return [payload]

        return []

    def _extract_single_record(self, payload: Any) -> Optional[Dict[str, Any]]:
        records = self._extract_records(payload)
        if records:
            return records[0]

        if isinstance(payload, dict):
            if "record" in payload and isinstance(payload["record"], dict):
                return payload["record"]
            if any(key in payload for key in ("id", "Id", "ID")):
                return payload

        return None

    def _first_value(self, payload: Dict[str, Any], *keys: str, default: Any = None) -> Any:
        for key in keys:
            if isinstance(payload, dict) and key in payload and payload[key] not in (None, ""):
                return payload[key]
        return default

    def _normalize_status(self, value: Any) -> str:
        status = str(value or "open").strip().lower().replace(" ", "_").replace("-", "_")
        return status if status in {"open", "in_progress", "closed"} else "open"

    def _normalize_priority(self, value: Any) -> str:
        priority = str(value or "medium").strip().lower()
        return priority if priority in {"low", "medium", "high"} else "medium"

    def _normalize_note_type(self, value: Any) -> str:
        note_type = str(value or "note").strip().lower().replace(" ", "_").replace("-", "_")
        return note_type if note_type in {"note", "status_change", "assignment"} else "note"

    def _normalize_note(self, record: Dict[str, Any], ticket_id: Optional[str] = None) -> Dict[str, Any]:
        flat_record = self._flatten_record(record)
        note_ticket_id = self._first_value(flat_record, "ticketId", "ticket_id", "ticket_ref", "ticketRef", default=ticket_id or "")
        note_id = self._first_value(flat_record, "id", "Id", "ID", "note_id", "noteId", default=note_ticket_id or "")
        note_content = self._first_value(flat_record, "content", "note_text", "noteText", default="")

        return {
            "id": str(note_id),
            "ticketId": str(note_ticket_id),
            "content": str(note_content),
            "author": str(self._first_value(flat_record, "author", default="System")),
            "createdAt": str(self._first_value(flat_record, "createdAt", "created_at", "CreatedAt", default=datetime.utcnow().isoformat())),
            "type": self._normalize_note_type(self._first_value(flat_record, "type", default="note")),
        }

    def _normalize_customer(self, record: Dict[str, Any], ticket_id: str) -> Dict[str, Any]:
        flat_record = self._flatten_record(record)
        customer_name = str(self._first_value(flat_record, "customer_name", "customerName", default="Unknown Customer"))
        customer_email = str(self._first_value(flat_record, "customer_email", "customerEmail", default="unknown@example.com"))
        customer_id = self._first_value(flat_record, "customer_id", "customerId", default=f"{ticket_id}-customer")
        created_at = str(self._first_value(flat_record, "customer_created_at", "customerCreatedAt", "created_at", "createdAt", default=datetime.utcnow().isoformat()))

        return {
            "id": str(customer_id),
            "name": customer_name,
            "email": customer_email,
            "createdAt": created_at,
        }

    def _normalize_ticket(self, record: Dict[str, Any], notes: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        flat_record = self._flatten_record(record)
        ticket_id = self._first_value(flat_record, "ticket_id", "ticketId", default=self._first_value(flat_record, "id", "Id", "ID", default=""))
        normalized_ticket_id = str(ticket_id)
        created_at = str(self._first_value(flat_record, "created_at", "createdAt", "CreatedAt", default=datetime.utcnow().isoformat()))
        updated_at = str(self._first_value(flat_record, "updated_at", "updatedAt", "UpdatedAt", default=created_at))

        return {
            "id": str(self._first_value(record, "id", "Id", "ID", default=normalized_ticket_id)),
            "ticketId": normalized_ticket_id,
            "customer": self._normalize_customer(flat_record, normalized_ticket_id),
            "subject": str(self._first_value(flat_record, "subject", default="")),
            "description": str(self._first_value(flat_record, "description", default="")),
            "status": self._normalize_status(self._first_value(flat_record, "status", default="open")),
            "priority": self._normalize_priority(self._first_value(flat_record, "priority", default="medium")),
            "createdAt": created_at,
            "updatedAt": updated_at,
            "notes": notes or [],
            "assignee": self._first_value(flat_record, "assignee", default=None),
        }

    async def _get_notes_for_ticket(self, ticket_id: str) -> List[Dict[str, Any]]:
        notes_response = await self.client.get(
            f"/api/v3/data/{self.project_id}/{self.notes_table_id}/records",
            params={"where": f"(ticket_ref,eq,{ticket_id})"}
        )
        notes_response.raise_for_status()
        note_records = self._extract_records(notes_response.json())
        return [self._normalize_note(note, ticket_id=ticket_id) for note in note_records]

    async def __aenter__(self):
        if self.client.is_closed:
            self.client = self._create_client()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()

    async def get_tickets(self, search: Optional[str] = None, status: Optional[str] = None) -> List[Dict]:
        """Get all tickets with optional search and status filter"""
        try:
            # Build query parameters
            params = {}
            
            # Add search filter if provided
            if search:
                # Search across multiple fields
                search_conditions = [
                    f"(ticket_id,like,%{search}%)",
                    f"(customer_name,like,%{search}%)",
                    f"(customer_email,like,%{search}%)",
                    f"(subject,like,%{search}%)",
                    f"(description,like,%{search}%)"
                ]
                params["where"] = f"or({','.join(search_conditions)})"
            
            # Add status filter if provided
            if status and status != "all":
                status_condition = f"(status,eq,{status})"
                if "where" in params:
                    params["where"] = f"and({params['where']},{status_condition})"
                else:
                    params["where"] = status_condition
            
            # Make request to NocoDB
            response = await self.client.get(
                f"/api/v3/data/{self.project_id}/{self.tickets_table_id}/records",
                params=params
            )
            response.raise_for_status()
            ticket_records = self._extract_records(response.json())
            return [self._normalize_ticket(ticket) for ticket in ticket_records]
        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch tickets: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error fetching tickets: {str(e)}")

    async def get_ticket_by_id(self, ticket_id: str) -> Optional[Dict]:
        """Get a specific ticket by its ID"""
        try:
            response = await self.client.get(
                f"/api/v3/data/{self.project_id}/{self.tickets_table_id}/records/{ticket_id}"
            )
            
            if response.status_code == 404:
                return None
                
            response.raise_for_status()
            ticket = self._extract_single_record(response.json())
            if not ticket:
                return None
            ticket_id_value = str(self._first_value(self._flatten_record(ticket), "ticket_id", "ticketId", default=ticket_id))
            notes = await self._get_notes_for_ticket(ticket_id_value)

            return self._normalize_ticket(ticket, notes=notes)
        except httpx.HTTPError as e:
            if e.response and e.response.status_code == 404:
                return None
            raise Exception(f"Failed to fetch ticket: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error fetching ticket: {str(e)}")

    async def create_ticket(self, ticket_data: Dict) -> Dict:
        """Create a new ticket"""
        try:
            ticket_data = dict(ticket_data)
            ticket_data["status"] = ticket_data.get("status", "open")
            ticket_data["priority"] = ticket_data.get("priority", "medium")
            ticket_data["created_at"] = datetime.utcnow().isoformat()
            ticket_data["updated_at"] = datetime.utcnow().isoformat()
            
            # Create the ticket
            response = await self.client.post(
                f"/api/v3/data/{self.project_id}/{self.tickets_table_id}/records",
                json={"fields": ticket_data}
            )
            response.raise_for_status()
            created_ticket = self._extract_single_record(response.json())
            created_ticket_flat = self._flatten_record(created_ticket or {})
            created_ticket_row_id = self._first_value(created_ticket_flat, "id", "Id", "ID", default=None)
            created_ticket_id = str(self._first_value(created_ticket_flat, "ticket_id", "ticketId", default=ticket_data.get("ticket_id", "")))
            
            # Create initial note if provided
            if ticket_data.get("initial_note"):
                note_data = {
                    "ticket_ref": created_ticket_id,
                    "content": ticket_data["initial_note"],
                    "author": "System",
                    "created_at": datetime.utcnow().isoformat(),
                    "type": "note"
                }
                await self.create_note(note_data)
            
            if created_ticket_row_id is not None:
                return await self.get_ticket_by_id(str(created_ticket_row_id))

            return self._normalize_ticket(created_ticket or {}, notes=[])
        except httpx.HTTPError as e:
            raise Exception(f"Failed to create ticket: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error creating ticket: {str(e)}")

    async def update_ticket(self, ticket_id: str, update_data: Dict) -> Dict:
        """Update a ticket"""
        try:
            update_data = dict(update_data)
            current_ticket = await self.get_ticket_by_id(ticket_id)
            update_fields = {k: v for k, v in update_data.items() if k not in {"note_content", "note_author"}}
            update_fields["updated_at"] = datetime.utcnow().isoformat()
            
            # Update the ticket
            if update_fields:
                response = await self.client.patch(
                    f"/api/v3/data/{self.project_id}/{self.tickets_table_id}/records",
                    json={"id": ticket_id, "fields": update_fields}
                )
                response.raise_for_status()
            
            # If note content is provided, create a note
            if update_data.get("note_content"):
                note_ticket_ref = current_ticket["ticketId"] if current_ticket else ticket_id
                note_data = {
                    "ticket_ref": note_ticket_ref,
                    "note_text": update_data["note_content"],
                    "author": update_data.get("note_author", "System"),
                    "created_at": datetime.utcnow().isoformat(),
                    "type": "note"
                }
                await self.create_note(note_data)
            
            # Fetch and return updated ticket
            return await self.get_ticket_by_id(ticket_id)
        except httpx.HTTPError as e:
            raise Exception(f"Failed to update ticket: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error updating ticket: {str(e)}")

    async def create_note(self, note_data: Dict) -> Dict:
        """Create a new note"""
        try:
            note_data = dict(note_data)
            if "created_at" not in note_data:
                note_data["created_at"] = datetime.utcnow().isoformat()

            if "note_text" not in note_data and "content" in note_data:
                note_data["note_text"] = note_data.pop("content")

            note_data.pop("author", None)
            note_data.pop("type", None)
            
            # Create the note
            response = await self.client.post(
                f"/api/v3/data/{self.project_id}/{self.notes_table_id}/records",
                json={"fields": note_data}
            )
            response.raise_for_status()
            raw_note = self._extract_single_record(response.json()) or {}
            note_ticket_id = str(note_data.get("ticket_ref") or note_data.get("ticketId") or self._first_value(self._flatten_record(raw_note), "ticket_ref", "ticketId", default=""))
            return self._normalize_note({**note_data, **raw_note}, ticket_id=note_ticket_id)
        except httpx.HTTPError as e:
            raise Exception(f"Failed to create note: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error creating note: {str(e)}")

    async def get_ticket_stats(self) -> Dict[str, int]:
        """Get ticket statistics"""
        try:
            # Get all tickets
            response = await self.client.get(
                f"/api/v3/data/{self.project_id}/{self.tickets_table_id}/records"
            )
            response.raise_for_status()
            tickets = [self._normalize_ticket(ticket) for ticket in self._extract_records(response.json())]
            
            # Calculate stats
            stats = {
                "total": len(tickets),
                "open": len([t for t in tickets if t.get("status") == "open"]),
                "inProgress": len([t for t in tickets if t.get("status") == "in_progress"]),
                "closed": len([t for t in tickets if t.get("status") == "closed"])
            }
            
            return stats
        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch ticket stats: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error fetching ticket stats: {str(e)}")