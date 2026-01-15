import type { Friend } from '../../backend';
import { useDeleteFriend } from '../../hooks/useQueries';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteFriendDialogProps {
  friend: Friend;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function DeleteFriendDialog({ friend, open, onOpenChange, onSuccess }: DeleteFriendDialogProps) {
  const deleteFriend = useDeleteFriend();

  const handleDelete = async () => {
    try {
      await deleteFriend.mutateAsync(friend.id);
      onSuccess();
    } catch (error) {
      toast.error('Failed to delete friend');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Friend</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {friend.name}? This will also remove all related transactions. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteFriend.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteFriend.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteFriend.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
