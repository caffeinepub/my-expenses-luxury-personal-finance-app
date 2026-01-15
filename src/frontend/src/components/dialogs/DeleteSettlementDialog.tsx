import { useDeleteSettlement } from '../../hooks/useQueries';
import type { Settlement } from '../../backend';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DeleteSettlementDialogProps {
  settlement: Settlement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteSettlementDialog({ settlement, open, onOpenChange }: DeleteSettlementDialogProps) {
  const deleteSettlement = useDeleteSettlement();

  const handleDelete = async () => {
    try {
      await deleteSettlement.mutateAsync(settlement.id);
      toast.success('Settlement deleted successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete settlement');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Settlement</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this settlement? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSettlement.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteSettlement.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
