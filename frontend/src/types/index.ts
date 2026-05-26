export type TicketStatus = 'open' | 'in_progress' | 'closed';

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  ticketId: string;
  content: string;
  author: string;
  createdAt: string;
  type: 'note' | 'status_change' | 'assignment';
}

export interface Ticket {
  id: string;
  ticketId: string;
  customer: Customer;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  notes: Note[];
  assignee?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

export interface CreateTicketData {
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
}

export interface AddNoteData {
  ticketId: string;
  content: string;
  author: string;
}
