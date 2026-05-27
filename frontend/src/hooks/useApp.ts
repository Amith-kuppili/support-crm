import { useState, useCallback, useEffect } from 'react';
import { Ticket, TicketStats, TicketStatus } from '../types';
import { ticketApi as api } from '../api/tickets';
import { toast } from 'sonner';

interface AppState {
  tickets: Ticket[];
  stats: TicketStats;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: TicketStatus | 'all';
}

export function useApp() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  const fetchTickets = useCallback(async (search?: string, status?: TicketStatus | 'all') => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTickets(search, status);
      setTickets(data);
    } catch (err) {
      setError('Failed to fetch tickets');
      toast.error('Failed to fetch tickets', {
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats');
      toast.error('Failed to fetch ticket stats', {
        duration: 1000,
      });
    }
  }, []);

  const createTicket = useCallback(async (data: Parameters<typeof api.createTicket>[0]) => {
    try {
      const createdTicket = await api.createTicket(data);
      setTickets((currentTickets) => [createdTicket, ...currentTickets]);
      await fetchStats();
      return createdTicket;
    } catch (err) {
      setError('Failed to create ticket');
      toast.error('Failed to create ticket', {
        duration: 1000,
      });
      return null;
    }
  }, [fetchTickets, fetchStats]);

  const updateTicketStatus = useCallback(async (id: string, status: TicketStatus) => {
    try {
      await api.updateTicketStatus(id, status);
      await fetchTickets();
      await fetchStats();
      return true;
    } catch (err) {
      setError('Failed to update ticket status');
      toast.error('Failed to update ticket status', {
        duration: 1000,
      });
      return false;
    }
  }, [fetchTickets, fetchStats]);

  const addNote = useCallback(async (ticketId: string, content: string, author: string) => {
    try {
      await api.addNote({ ticketId, content, author });
      return true;
    } catch (err) {
      setError('Failed to add note');
      toast.error('Failed to add note', {
        duration: 1000,
      });
      return false;
    }
  }, []);

  const getTicketById = useCallback(async (id: string) => {
    try {
      return await api.getTicketById(id);
    } catch (err) {
      setError('Failed to fetch ticket');
      toast.error('Failed to fetch ticket', {
        duration: 1000,
      });
      return undefined;
    }
  }, []);

  useEffect(() => {
    fetchTickets(searchQuery || undefined, statusFilter);
    fetchStats();
  }, [fetchTickets, fetchStats, searchQuery, statusFilter]);

  return {
    tickets,
    stats,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    createTicket,
    updateTicketStatus,
    addNote,
    getTicketById,
    fetchTickets,
    fetchStats,
  };
}
