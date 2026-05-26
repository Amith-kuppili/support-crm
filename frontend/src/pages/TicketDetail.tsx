import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { TicketDetails } from '@/components/TicketDetails';
import { NotesSection } from '@/components/NotesSection';
import { Ticket } from '@/types';
import { useAppContext } from '@/context/AppContext';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTicketById, updateTicketStatus, addNote, fetchTickets } = useAppContext();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTicket() {
      if (!id) return;
      setLoading(true);
      const data = await getTicketById(id);
      setTicket(data || null);
      setLoading(false);
    }
    loadTicket();
  }, [id, getTicketById]);

  const handleStatusChange = async (status: Ticket['status']) => {
    if (!id) return false;
    const success = await updateTicketStatus(id, status);
    if (success) {
      await fetchTickets();
      setTicket((prev) => (prev ? { ...prev, status } : null));
    }
    return success;
  };

  const handleAddNote = async (content: string, author: string) => {
    if (!id) return false;
    const success = await addNote(id, content, author);
    if (success) {
      const updated = await getTicketById(id);
      setTicket(updated || null);
    }
    return success;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <EmptyState
          title="Ticket not found"
          description="The ticket you're looking for doesn't exist or has been deleted."
          action={
            <Link to="/">
              <Button>Go to Dashboard</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Ticket Details</h1>
          <p className="text-muted-foreground mt-1">
            View and manage ticket information
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Ticket Details */}
        <div>
          <TicketDetails ticket={ticket} onStatusChange={handleStatusChange} />
        </div>

        {/* Right Column - Notes */}
        <div>
          <NotesSection
            ticketId={ticket.id}
            notes={ticket.notes}
            onAddNote={handleAddNote}
          />
        </div>
      </div>
    </div>
  );
}
