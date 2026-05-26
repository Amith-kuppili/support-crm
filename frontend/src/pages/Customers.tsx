import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Ticket, Users, Inbox } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

type CustomerSummary = {
  id: string;
  name: string;
  email: string;
  ticketCount: number;
  openCount: number;
  inProgressCount: number;
  closedCount: number;
  lastSubject: string;
  lastUpdated: string;
};

export default function Customers() {
  const { tickets } = useAppContext();

  const customers = useMemo<CustomerSummary[]>(() => {
    const map = new Map<string, CustomerSummary>();

    tickets.forEach((ticket) => {
      const customerId = ticket.customer.id || ticket.customer.email || ticket.customer.name;
      const existing = map.get(customerId);
      const currentLastUpdated = existing ? new Date(existing.lastUpdated).getTime() : 0;
      const ticketUpdated = new Date(ticket.updatedAt).getTime();

      const nextSummary: CustomerSummary = existing
        ? {
            ...existing,
            ticketCount: existing.ticketCount + 1,
            openCount: existing.openCount + (ticket.status === 'open' ? 1 : 0),
            inProgressCount: existing.inProgressCount + (ticket.status === 'in_progress' ? 1 : 0),
            closedCount: existing.closedCount + (ticket.status === 'closed' ? 1 : 0),
            lastSubject: ticketUpdated >= currentLastUpdated ? ticket.subject : existing.lastSubject,
            lastUpdated: ticketUpdated >= currentLastUpdated ? ticket.updatedAt : existing.lastUpdated,
          }
        : {
            id: customerId,
            name: ticket.customer.name,
            email: ticket.customer.email,
            ticketCount: 1,
            openCount: ticket.status === 'open' ? 1 : 0,
            inProgressCount: ticket.status === 'in_progress' ? 1 : 0,
            closedCount: ticket.status === 'closed' ? 1 : 0,
            lastSubject: ticket.subject,
            lastUpdated: ticket.updatedAt,
          };

      map.set(customerId, nextSummary);
    });

    return Array.from(map.values()).sort((left, right) => {
      return new Date(right.lastUpdated).getTime() - new Date(left.lastUpdated).getTime();
    });
  }, [tickets]);

  const totals = useMemo(
    () => ({
      customers: customers.length,
      open: customers.reduce((sum, customer) => sum + customer.openCount, 0),
      inProgress: customers.reduce((sum, customer) => sum + customer.inProgressCount, 0),
      closed: customers.reduce((sum, customer) => sum + customer.closedCount, 0),
    }),
    [customers]
  );

  const stats = [
    { label: 'Customers', value: totals.customers, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Open Requests', value: totals.open, icon: Inbox, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'In Progress', value: totals.inProgress, icon: Ticket, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Closed', value: totals.closed, icon: Ticket, color: 'text-slate-500', bg: 'bg-slate-500/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="text-muted-foreground mt-1">A live list of the customers currently represented in your support tickets.</p>
        </div>
        <Link to="/create">
          <Button className="w-full md:w-auto">
            <Ticket className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {customers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="No customers loaded"
          description="Once the backend can read the support data, customers will appear here automatically."
          action={
            <Link to="/create">
              <Button>
                <Ticket className="w-4 h-4 mr-2" />
                Create the first ticket
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {customers.map((customer) => (
            <Card key={customer.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar name={customer.name} size="lg" />
                  <div>
                    <CardTitle>{customer.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      <span>{customer.email}</span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default">{customer.ticketCount} tickets</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Open</p>
                    <p className="text-lg font-semibold text-emerald-500">{customer.openCount}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">In Progress</p>
                    <p className="text-lg font-semibold text-amber-500">{customer.inProgressCount}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Closed</p>
                    <p className="text-lg font-semibold text-slate-500">{customer.closedCount}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Latest ticket</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{customer.lastSubject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Updated {new Date(customer.lastUpdated).toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-end">
                  <Link to="/">
                    <Button variant="ghost" size="sm">
                      View dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
