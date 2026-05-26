import { Input } from './ui/Input';
import { Search } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useAppContext();

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search tickets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 h-9 bg-muted/50 border-0 focus:bg-background focus:ring-1"
      />
    </div>
  );
}
