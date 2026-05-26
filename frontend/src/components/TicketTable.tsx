import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import { Ticket } from '@/types';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { Skeleton } from './ui/Skeleton';

interface TicketTableProps {
  tickets: Ticket[];
  loading?: boolean;
}

function TableSkeleton() {
  return (
    <div className="w-full">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-4 border-b border-border last:border-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export function TicketTable({ tickets, loading }: TicketTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Desktop table header */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <div className="col-span-4">Customer</div>
        <div className="col-span-4">Subject</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Created</div>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-border">
        {tickets.map((ticket) => {
          const statusVariant = ticket.status === 'open' ? 'open' : ticket.status === 'in_progress' ? 'in_progress' : 'closed';
          const priorityVariant = ticket.priority === 'low' ? 'low' : ticket.priority === 'medium' ? 'medium' : 'high';

          return (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="block md:grid md:grid-cols-12 gap-4 p-4 hover:bg-accent/50 transition-colors group"
            >
              {/* Customer - col-span-4 */}
              <div className="col-span-4 flex items-center gap-3">
                <Avatar name={ticket.customer.name} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground md:hidden">
                      Customer
                    </span>
                    <span className="text-sm font-medium truncate">{ticket.customer.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground hidden md:block">{ticket.customer.email}</span>
                </div>
              </div>

              {/* Subject - col-span-4 */}
              <div className="col-span-4 flex items-center gap-2 md:pl-4">
                <span className="text-xs font-medium text-muted-foreground md:hidden">Subject</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden md:block">{ticket.ticketId}</span>
                    <Badge variant={priorityVariant} className="hidden md:inline-flex">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground truncate group-hover:text-foreground transition-colors">
                    {ticket.subject}
                  </span>
                </div>
              </div>

              {/* Status - col-span-2 */}
              <div className="col-span-2 flex items-center">
                <span className="text-xs font-medium text-muted-foreground md:hidden mr-2">Status</span>
                <Badge variant={statusVariant} className="text-[10px] md:text-xs">
                  {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </Badge>
              </div>

              {/* Created - col-span-2 */}
              <div className="col-span-2 flex items-center justify-between md:justify-start">
                <span className="text-xs font-medium text-muted-foreground md:hidden mr-2">Created</span>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {formatDate(ticket.createdAt)}
                </span>
                <span className="text-sm text-muted-foreground md:hidden">
                  {formatRelativeTime(ticket.createdAt)}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity md:hidden" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
