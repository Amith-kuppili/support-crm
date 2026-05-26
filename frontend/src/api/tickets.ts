import { Ticket, TicketStats, CreateTicketData, AddNoteData, Note } from '../types';

// Get base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

export const api = {
  async getTickets(search?: string, status?: string): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/tickets${queryString}`);
  },

  async searchTickets(search: string): Promise<Ticket[]> {
    return this.getTickets(search);
  },

  async filterTickets(status: Ticket['status'] | 'all'): Promise<Ticket[]> {
    return this.getTickets(undefined, status);
  },

  async getTicketById(id: string): Promise<Ticket> {
    return apiRequest(`/tickets/${id}`);
  },

  async createTicket(data: CreateTicketData): Promise<Ticket> {
    return apiRequest('/tickets', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        subject: data.subject,
        description: data.description,
      }),
    });
  },

  async updateTicketStatus(id: string, status: Ticket['status']): Promise<Ticket> {
    return apiRequest(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async addNote(data: AddNoteData): Promise<Note> {
    return apiRequest(`/tickets/${data.ticketId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        note_content: data.content,
        note_author: data.author,
      }),
    });
  },

  async getStats(): Promise<TicketStats> {
    return apiRequest('/tickets/stats');
  },
};