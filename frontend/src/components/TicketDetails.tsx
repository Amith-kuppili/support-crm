import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Select } from './ui/Select';
import { formatDateTime } from '@/lib/utils';
import { Ticket, TicketStatus } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';

interface TicketDetailsProps {
  ticket: Ticket;
  onStatusChange: (status: TicketStatus) => Promise<boolean>;
}

export function TicketDetails({ ticket, onStatusChange }: TicketDetailsProps) {
  const [selectedStatus, setSelectedStatus] = useState(ticket.status);

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' },
  ];

  const statusVariant = ticket.status === 'open' ? 'open' : ticket.status === 'in_progress' ? 'in_progress' : 'closed';
  const priorityVariant = ticket.priority === 'low' ? 'low' : ticket.priority === 'medium' ? 'medium' : 'high';

  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus as TicketStatus);
    const success = await onStatusChange(newStatus as TicketStatus);
    if (success) {
      toast.success(`Ticket status updated to ${newStatus.replace('_', ' ')}`);
    } else {
      setSelectedStatus(ticket.status);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-muted-foreground">{ticket.ticketId}</span>
            <Badge variant={statusVariant}>
              {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
            <Badge variant={priorityVariant}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
            </Badge>
          </div>
          <h1 className="text-xl font-semibold">{ticket.subject}</h1>
        </div>
      </div>

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar name={ticket.customer.name} size="lg" />
            <div>
              <p className="font-medium">{ticket.customer.name}</p>
              <p className="text-sm text-muted-foreground">{ticket.customer.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Customer since {formatDateTime(ticket.customer.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Details */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDateTime(ticket.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDateTime(ticket.updatedAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Assigned To</p>
              <p className="font-medium">{ticket.assignee || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Priority</p>
              <p className="font-medium capitalize">{ticket.priority}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
