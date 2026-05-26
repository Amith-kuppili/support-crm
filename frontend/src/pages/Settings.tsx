import { Bell, CheckCircle2, ShieldCheck, UserCircle2, Wrench } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';

export default function Settings() {
  const { stats, tickets } = useAppContext();

  const settingsCards = [
    {
      icon: ShieldCheck,
      title: 'Security',
      description: 'Password rotation, access control, and session monitoring are active.',
      accent: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      value: 'Protected',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Email and in-app alerts are enabled for assignment and status changes.',
      accent: 'text-amber-500',
      bg: 'bg-amber-500/10',
      value: 'Enabled',
    },
    {
      icon: Wrench,
      title: 'Workspace',
      description: 'The support workspace is connected to the current CRM environment.',
      accent: 'text-primary',
      bg: 'bg-primary/10',
      value: 'Connected',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Basic account and workspace settings for the support team.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name="AMITH KUPPILI" size="lg" />
              <div>
                <p className="text-sm text-muted-foreground">Account owner</p>
                <h2 className="text-xl font-semibold">AMITH KUPPILI</h2>
                <p className="text-sm text-muted-foreground">amith.kuppili@supportcrm.local · Admin</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Admin</Badge>
              <Badge variant="open">Active</Badge>
              <Badge variant="medium">Verified</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {settingsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${card.accent}`} />
                  </div>
                  <Badge variant="default">{card.value}</Badge>
                </div>
                <div>
                  <p className="font-semibold">{card.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Primary contact details for the CRM workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <span className="text-muted-foreground">Display name</span>
              <span className="font-medium">AMITH KUPPILI</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">Administrator</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <span className="text-muted-foreground">Preferred contact</span>
              <span className="font-medium">amith.kuppili@supportcrm.local</span>
            </div>
            <div className="flex items-center justify-end">
              <Button variant="outline">Edit profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace snapshot</CardTitle>
            <CardDescription>Current queue health and support workspace metadata.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <span className="text-muted-foreground">Total tickets</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <span className="text-muted-foreground">Open tickets</span>
              <span className="font-medium text-emerald-500">{stats.open}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <span className="text-muted-foreground">Latest sync</span>
              <span className="font-medium">Connected to backend</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{tickets.length > 0 ? 'Live tickets are ready for review.' : 'Awaiting live ticket data from the backend.'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
