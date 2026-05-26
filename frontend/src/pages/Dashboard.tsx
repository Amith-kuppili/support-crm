import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, List, Ticket as TicketIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TicketCard } from '@/components/TicketCard';
import { TicketTable } from '@/components/TicketTable';
import { StatusFilter } from '@/components/StatusFilter';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { TicketSkeleton } from '@/components/ui/TicketSkeleton';
import { useAppContext } from '@/context/AppContext';

type ViewMode = 'cards' | 'table';

export default function Dashboard() {
  const { tickets, stats, loading, searchQuery } = useAppContext();
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const statCards = [
    {
      label: 'Total Tickets',
      value: stats.total,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Open Tickets',
      value: stats.open,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Closed Tickets',
      value: stats.closed,
      color: 'text-slate-500',
      bg: 'bg-slate-500/10',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your support tickets
          </p>
        </div>
        <Link to="/create">
          <Button className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                    {loading ? <Spinner size="sm" /> : stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <TicketIcon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-sm">
          <StatusFilter />
        </div>
        <div className="flex items-center gap-1 border border-border rounded-lg p-1">
          <Button
            variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="h-8"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="h-8"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <TicketSkeleton />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={<TicketIcon className="h-8 w-8" />}
          title={searchQuery ? 'No tickets found' : 'No tickets yet'}
          description={
            searchQuery
              ? `No tickets match "${searchQuery}". Try adjusting your search or filters.`
              : 'Create your first ticket to get started with support management.'
          }
          action={
            <Link to="/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
            </Link>
          }
        />
      ) : viewMode === 'cards' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <TicketTable tickets={tickets} />
      )}
    </div>
  );
}
