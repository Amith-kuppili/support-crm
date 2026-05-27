import axios from 'axios';
import { Ticket, TicketStats, CreateTicketData, AddNoteData, Note } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const ticketApi = {
  async getTickets(search?: string, status?: string): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/tickets${queryString}`);
    return response.data as Ticket[];
  },

  async searchTickets(search: string): Promise<Ticket[]> {
    return this.getTickets(search);
  },

  async filterTickets(status: Ticket['status'] | 'all'): Promise<Ticket[]> {
    return this.getTickets(undefined, status);
  },

  async getTicketById(id: string): Promise<Ticket> {
    const response = await api.get(`/tickets/${id}`);
    return response.data as Ticket;
  },

  async createTicket(data: CreateTicketData): Promise<Ticket> {
    const response = await api.post('/tickets', {
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      subject: data.subject,
      description: data.description,
    });
    return response.data as Ticket;
  },

  async updateTicketStatus(id: string, status: Ticket['status']): Promise<Ticket> {
    const response = await api.put(`/tickets/${id}`, { status });
    return response.data as Ticket;
  },

  async addNote(data: AddNoteData): Promise<Note> {
    const response = await api.put(`/tickets/${data.ticketId}`, {
      note_content: data.content,
      note_author: data.author,
    });
    return response.data as Note;
  },

  async getStats(): Promise<TicketStats> {
    const response = await api.get('/tickets/stats');
    return response.data as TicketStats;
  },
};
