import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TicketForm } from '@/components/TicketForm';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function CreateTicket() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
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
          <h1 className="text-2xl font-semibold">Create Ticket</h1>
          <p className="text-muted-foreground mt-1">
            Submit a new support ticket
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketForm />
        </CardContent>
      </Card>
    </div>
  );
}
