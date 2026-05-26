import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import { Ticket } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const statusVariant = ticket.status === 'open' ? 'open' : ticket.status === 'in_progress' ? 'in_progress' : 'closed';
  const priorityVariant = ticket.priority === 'low' ? 'low' : ticket.priority === 'medium' ? 'medium' : 'high';

  return (
    <Link to={`/tickets/${ticket.id}`}>
      <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-200 group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Avatar name={ticket.customer.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {ticket.ticketId}
                  </span>
                  <Badge variant={statusVariant} className="text-[10px] px-1.5 py-0.5">
                    {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </Badge>
                </div>
                <h3 className="font-medium text-foreground truncate mb-0.5 group-hover:text-primary transition-colors">
                  {ticket.subject}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {ticket.customer.name}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{formatRelativeTime(ticket.createdAt)}</span>
              {ticket.assignee && (
                <span>Assigned to {ticket.assignee}</span>
              )}
            </div>
            <Badge variant={priorityVariant}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
