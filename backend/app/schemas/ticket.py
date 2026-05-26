from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class TicketStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"


class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class NoteType(str, Enum):
    NOTE = "note"
    STATUS_CHANGE = "status_change"
    ASSIGNMENT = "assignment"


class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class CustomerCreate(CustomerBase):
    pass


class Customer(CustomerBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class NoteBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    author: str = Field(..., min_length=1, max_length=100)


class NoteCreate(NoteBase):
    ticket_id: str


class Note(NoteBase):
    id: str
    ticket_id: str
    created_at: datetime
    type: NoteType

    class Config:
        from_attributes = True


class TicketBase(BaseModel):
    subject: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    customer_name: str = Field(..., min_length=1, max_length=100)
    customer_email: EmailStr


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    note_content: Optional[str] = Field(None, max_length=1000)
    note_author: Optional[str] = Field(None, max_length=100)


class Ticket(TicketBase):
    id: str
    ticket_id: str
    status: TicketStatus
    priority: Priority
    created_at: datetime
    updated_at: datetime
    notes: List[Note] = []

    class Config:
        from_attributes = True


class TicketStats(BaseModel):
    total: int
    open: int
    in_progress: int
    closed: int


class TicketResponse(BaseModel):
    id: str
    ticket_id: str
    customer: Customer
    subject: str
    description: str
    status: TicketStatus
    priority: Priority
    created_at: datetime
    updated_at: datetime
    notes: List[Note] = []
    assignee: Optional[str] = None

    class Config:
        from_attributes = True