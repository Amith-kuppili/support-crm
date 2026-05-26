import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Note } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { MessageSquare, RefreshCw } from 'lucide-react';

interface NotesSectionProps {
  ticketId: string;
  notes: Note[];
  onAddNote: (content: string, author: string) => Promise<boolean>;
}

export function NotesSection({ ticketId, notes, onAddNote }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await onAddNote(newNote, 'Support Team');
      if (success) {
        setNewNote('');
        toast.success('Note added successfully');
      } else {
        toast.error('Failed to add note');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Notes & Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Note Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" isLoading={isSubmitting} disabled={!newNote.trim()}>
            Add Note
          </Button>
        </form>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs">Add a note to start the conversation</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="flex gap-3">
                <Avatar name={note.author} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{note.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(note.createdAt)}
                    </span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
