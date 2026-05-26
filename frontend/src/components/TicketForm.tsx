import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import { FormField } from './ui/FormField';
import { ErrorMessage } from './ui/ErrorMessage';
import { useAppContext } from '@/context/AppContext';
import { Ticket } from '@/types';

interface FormData {
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
}

interface FormErrors {
  customerName?: string;
  customerEmail?: string;
  subject?: string;
  description?: string;
}

export function TicketForm() {
  const navigate = useNavigate();
  const { createTicket } = useAppContext();
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    subject: '',
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdTicket = (await createTicket(formData)) as Ticket | null;
      if (createdTicket) {
        toast.success('Ticket created successfully');
        navigate(`/tickets/${createdTicket.id}`);
      } else {
        toast.error('Failed to create ticket');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField>
        <Label htmlFor="customerName" required>Customer Name</Label>
        <Input
          id="customerName"
          type="text"
          placeholder="Enter customer's full name"
          value={formData.customerName}
          onChange={handleChange('customerName')}
          className={errors.customerName ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        <ErrorMessage message={errors.customerName} />
      </FormField>

      <FormField>
        <Label htmlFor="customerEmail" required>Customer Email</Label>
        <Input
          id="customerEmail"
          type="email"
          placeholder="customer@example.com"
          value={formData.customerEmail}
          onChange={handleChange('customerEmail')}
          className={errors.customerEmail ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        <ErrorMessage message={errors.customerEmail} />
      </FormField>

      <FormField>
        <Label htmlFor="subject" required>Subject</Label>
        <Input
          id="subject"
          type="text"
          placeholder="Brief summary of the issue"
          value={formData.subject}
          onChange={handleChange('subject')}
          className={errors.subject ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        <ErrorMessage message={errors.subject} />
      </FormField>

      <FormField>
        <Label htmlFor="description" required>Description</Label>
        <Textarea
          id="description"
          placeholder="Provide detailed information about the issue..."
          value={formData.description}
          onChange={handleChange('description')}
          className={errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        <ErrorMessage message={errors.description} />
      </FormField>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" isLoading={isSubmitting}>
          Create Ticket
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
