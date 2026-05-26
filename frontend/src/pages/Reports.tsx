import { BarChart3, CircleDashed, Clock3, TicketCheck } from 'lucide-react';
import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

export default function Reports() {
  const { tickets, stats } = useAppContext();

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      .slice(0, 5);
  }, [tickets]);

  const breakdown = [
    { label: 'Open', value: stats.open, color: 'bg-emerald-500' },
    { label: 'In Progress', value: stats.inProgress, color: 'bg-amber-500' },
    { label: 'Closed', value: stats.closed, color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-muted-foreground mt-1">A compact operational view of the current support workload.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Work</p>
              <p className="text-2xl font-bold mt-1 text-emerald-500">{stats.open}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CircleDashed className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Closed</p>
              <p className="text-2xl font-bold mt-1 text-slate-500">{stats.closed}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-500">
              <TicketCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status mix</CardTitle>
          <CardDescription>The current ticket distribution by status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {breakdown.map((item) => {
            const percentage = stats.total ? Math.round((item.value / stats.total) * 100) : 0;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value} tickets</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>The latest tickets touching the queue.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTickets.length === 0 ? (
            <EmptyState
              icon={<Clock3 className="h-8 w-8" />}
              title="No recent activity"
              description="Once tickets are returned by the backend, the latest activity will show up here."
            />
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">{ticket.customer.name} · {ticket.customer.email}</p>
                  </div>
                  <Badge variant={ticket.status}>{ticket.status.replace('_', ' ')}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
