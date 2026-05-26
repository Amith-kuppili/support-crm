import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Search, Sun, Moon, X, CheckCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { SearchBar } from './SearchBar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { formatRelativeTime } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [seenTicketIds, setSeenTicketIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = window.localStorage.getItem('crm-seen-ticket-notifications');
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
      return [];
    }
  });
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const { tickets } = useAppContext();

  const seenTicketIdsKey = 'crm-seen-ticket-notifications';
  const notificationAnchorKey = 'crm-notification-anchor-at';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!window.localStorage.getItem(notificationAnchorKey)) {
      window.localStorage.setItem(notificationAnchorKey, new Date().toISOString());
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unseenNotifications = useMemo(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const anchorValue = window.localStorage.getItem(notificationAnchorKey);
    const anchorTime = anchorValue ? new Date(anchorValue).getTime() : Date.now();

    return [...tickets]
      .filter((ticket) => new Date(ticket.createdAt).getTime() >= anchorTime)
      .filter((ticket) => !seenTicketIds.includes(ticket.id))
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, 10);
  }, [tickets, seenTicketIds]);

  const persistSeenTickets = (nextSeenIds: string[]) => {
    setSeenTicketIds(nextSeenIds);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(seenTicketIdsKey, JSON.stringify(nextSeenIds));
    }
  };

  const markTicketSeen = (ticketId: string) => {
    if (seenTicketIds.includes(ticketId)) {
      return;
    }

    persistSeenTickets([...seenTicketIds, ticketId]);
  };

  const markAllSeen = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(notificationAnchorKey, new Date().toISOString());
    }
    persistSeenTickets([]);
  };

  // Listen for storage changes (for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('crm-theme');
      const hasDark = document.documentElement.classList.contains('dark');
      setIsDark(stored === 'dark' || (!stored && hasDark));
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for changes made in same tab
    const interval = setInterval(() => {
      const hasDark = document.documentElement.classList.contains('dark');
      if (hasDark !== isDark) {
        setIsDark(hasDark);
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isDark]);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newIsDark = !isDark;

    if (newIsDark) {
      root.classList.add('dark');
      localStorage.setItem('crm-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('crm-theme', 'light');
    }

    setIsDark(newIsDark);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Desktop search */}
          <div className="hidden md:block">
            <SearchBar />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications((current) => !current)}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unseenNotifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 rounded-full bg-destructive px-1 text-[10px] font-semibold leading-5 text-destructive-foreground">
                  {unseenNotifications.length}
                </span>
              )}
            </Button>

            {showNotifications && (
              <Card className="absolute right-0 mt-3 w-[22rem] max-w-[calc(100vw-2rem)] shadow-xl border-border/80">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base">Recent Tickets</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Unseen created tickets, newest first
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={markAllSeen} disabled={unseenNotifications.length === 0}>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Mark all seen
                  </Button>
                </CardHeader>
                <CardContent className="max-h-[24rem] overflow-y-auto space-y-2">
                  {unseenNotifications.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                      No unseen ticket notifications right now.
                    </div>
                  ) : (
                    unseenNotifications.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-lg border border-border/70 bg-background p-3 transition-colors hover:bg-accent/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="min-w-0 flex-1"
                            onClick={() => {
                              markTicketSeen(ticket.id);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{ticket.ticketId}</span>
                              <span>{formatRelativeTime(ticket.createdAt)}</span>
                            </div>
                            <p className="mt-1 truncate text-sm font-medium text-foreground">{ticket.subject}</p>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {ticket.customer.name} · {ticket.customer.email}
                            </p>
                          </Link>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => markTicketSeen(ticket.id)}
                            aria-label={`Mark ${ticket.ticketId} as seen`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="md:hidden border-t border-border p-4 bg-background">
          <SearchBar />
        </div>
      )}
    </header>
  );
}