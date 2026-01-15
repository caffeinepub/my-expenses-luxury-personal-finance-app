import { useDeleteExpense } from '../../hooks/useQueries';
import type { Expense } from '../../backend';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DeleteExpenseDialogProps {
  expense: Expense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteExpenseDialog({ expense, open, onOpenChange }: DeleteExpenseDialogProps) {
  const deleteExpense = useDeleteExpense();

  const handleDelete = async () => {
    try {
      await deleteExpense.mutateAsync(expense.id);
      toast.success('Expense deleted successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{expense.item}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteExpense.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteExpense.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
