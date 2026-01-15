import { useState } from 'react';
import type { Friend } from '../../backend';
import { useAddExpense, useAddSettlement } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddTransactionDialogProps {
  friend: Friend;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTransactionDialog({ friend, open, onOpenChange }: AddTransactionDialogProps) {
  const [transactionType, setTransactionType] = useState<'borrowed' | 'lent'>('borrowed');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const addExpense = useAddExpense();
  const addSettlement = useAddSettlement();

  const resetForm = () => {
    setItem('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setTransactionType('borrowed');
  };

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
      if (transactionType === 'borrowed') {
        // Add as expense where friend paid
        await addExpense.mutateAsync({
          item: item.trim(),
          amount: amountNum,
          date: dateTimestamp,
          paidBy: friend.name,
          friendId: friend.id,
        });
        toast.success('Borrowed transaction added!');
      } else {
        // Add as settlement where friend paid me
        await addSettlement.mutateAsync({
          friendId: friend.id,
          amount: amountNum,
          date: dateTimestamp,
          direction: 'PaidToMe',
        });
        toast.success('Lent transaction added!');
      }
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add transaction');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={transactionType} onValueChange={(v) => setTransactionType(v as 'borrowed' | 'lent')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
              <TabsTrigger value="lent">Lent</TabsTrigger>
            </TabsList>

            <TabsContent value="borrowed" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="item" className="text-white">Item</Label>
                <Input
                  id="item"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder="What was borrowed?"
                  className="bg-background/50 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-background/50 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>
            </TabsContent>

            <TabsContent value="lent" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="lent-item" className="text-white">Description</Label>
                <Input
                  id="lent-item"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder="Payment description"
                  className="bg-background/50 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lent-amount" className="text-white">Amount (₹)</Label>
                <Input
                  id="lent-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-background/50 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lent-date" className="text-white">Date</Label>
                <Input
                  id="lent-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={addExpense.isPending || addSettlement.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addExpense.isPending || addSettlement.isPending}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
            >
              {(addExpense.isPending || addSettlement.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Transaction'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
