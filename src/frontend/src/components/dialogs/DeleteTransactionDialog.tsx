import { useDeleteExpense, useDeleteSettlement } from '../../hooks/useQueries';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Transaction = {
  id: bigint;
  type: 'borrowed' | 'lent';
  item: string;
  amount: number;
  date: bigint;
  source: 'expense' | 'settlement';
};

interface DeleteTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteTransactionDialog({ transaction, open, onOpenChange }: DeleteTransactionDialogProps) {
  const deleteExpense = useDeleteExpense();
  const deleteSettlement = useDeleteSettlement();

  const handleDelete = async () => {
    try {
      if (transaction.source === 'expense') {
        await deleteExpense.mutateAsync(transaction.id);
      } else {
        await deleteSettlement.mutateAsync(transaction.id);
      }
      toast.success('Transaction deleted!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const isPending = deleteExpense.isPending || deleteSettlement.isPending;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {transaction.type} transaction for ₹{transaction.amount.toFixed(2)}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
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
