import { useState, useEffect } from 'react';
import type { Friend } from '../../backend';
import { useUpdateFriend } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditFriendDialogProps {
  friend: Friend;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditFriendDialog({ friend, open, onOpenChange }: EditFriendDialogProps) {
  const [name, setName] = useState(friend.name);
  const updateFriend = useUpdateFriend();

  useEffect(() => {
    setName(friend.name);
  }, [friend.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      await updateFriend.mutateAsync({ id: friend.id, name: name.trim() });
      toast.success('Friend updated!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update friend');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Friend</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="friend-name" className="text-white">Name</Label>
            <Input
              id="friend-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Friend's name"
              className="bg-background/50 border-white/10"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={updateFriend.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateFriend.isPending}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
            >
              {updateFriend.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
