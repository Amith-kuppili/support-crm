import { Select } from './ui/Select';
import { useAppContext } from '@/context/AppContext';
import { TicketStatus } from '@/types';

export function StatusFilter() {
  const { statusFilter, setStatusFilter } = useAppContext();

  const options = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <Select
      options={options}
      value={statusFilter}
      onChange={(value) => setStatusFilter(value as TicketStatus | 'all')}
      placeholder="Filter by status"
    />
  );
}
