import { useState } from 'react';
import { useAddFriend } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AddFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddFriendDialog({ open, onOpenChange }: AddFriendDialogProps) {
  const [name, setName] = useState('');
  const addFriend = useAddFriend();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      await addFriend.mutateAsync(name.trim());
      toast.success('Friend added successfully!');
      setName('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add friend');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Add Friend</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Friend's Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50 border-white/10"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addFriend.isPending}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white"
            >
              {addFriend.isPending ? 'Adding...' : 'Add Friend'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
