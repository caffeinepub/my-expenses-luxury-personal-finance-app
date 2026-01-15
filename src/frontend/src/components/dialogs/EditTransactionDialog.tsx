import { useState, useEffect } from 'react';
import type { Friend } from '../../backend';
import { useUpdateExpense, useUpdateSettlement } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface EditTransactionDialogProps {
  transaction: Transaction;
  friend: Friend;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTransactionDialog({ transaction, friend, open, onOpenChange }: EditTransactionDialogProps) {
  const [item, setItem] = useState(transaction.item);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState('');

  const updateExpense = useUpdateExpense();
  const updateSettlement = useUpdateSettlement();

  useEffect(() => {
    const dateObj = new Date(Number(transaction.date) / 1000000);
    setDate(dateObj.toISOString().split('T')[0]);
    setItem(transaction.item);
    setAmount(transaction.amount.toString());
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item.trim()) {
      toast.error('Please enter an item description');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const dateTimestamp = BigInt(new Date(date).getTime() * 1000000);

    try {
      if (transaction.source === 'expense') {
        await updateExpense.mutateAsync({
          id: transaction.id,
          item: item.trim(),
          amount: amountNum,
          date: dateTimestamp,
          paidBy: friend.name,
          friendId: friend.id,
        });
        toast.success('Transaction updated!');
      } else {
        await updateSettlement.mutateAsync({
          id: transaction.id,
          friendId: friend.id,
          amount: amountNum,
          date: dateTimestamp,
          direction: 'PaidToMe',
        });
        toast.success('Transaction updated!');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update transaction');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-item" className="text-white">
              {transaction.source === 'expense' ? 'Item' : 'Description'}
            </Label>
            <Input
              id="edit-item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder={transaction.source === 'expense' ? 'What was borrowed?' : 'Payment description'}
              className="bg-background/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount" className="text-white">Amount (₹)</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-background/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-white">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background/50 border-white/10"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={updateExpense.isPending || updateSettlement.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateExpense.isPending || updateSettlement.isPending}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
            >
              {(updateExpense.isPending || updateSettlement.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Transaction'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
