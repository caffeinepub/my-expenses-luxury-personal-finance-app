import { useState } from 'react';
import { useAddExpense, useGetFriends } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddExpenseDialog({ open, onOpenChange }: AddExpenseDialogProps) {
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState<'Me' | 'Friend'>('Me');
  const [friendId, setFriendId] = useState<string>('');

  const addExpense = useAddExpense();
  const { data: friends } = useGetFriends();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item.trim() || !amount || parseFloat(amount) <= 0) {
      toast.error('Please fill all fields correctly');
      return;
    }

    if (paidBy === 'Friend' && !friendId) {
      toast.error('Please select a friend');
      return;
    }

    try {
      const dateTimestamp = BigInt(new Date(date).getTime() * 1000000);
      await addExpense.mutateAsync({
        item: item.trim(),
        amount: parseFloat(amount),
        date: dateTimestamp,
        paidBy: paidBy === 'Me' ? 'Me' : friendId,
        friendId: paidBy === 'Friend' ? BigInt(friendId) : null,
      });

      toast.success('Expense added successfully!');
      setItem('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaidBy('Me');
      setFriendId('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Add Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item" className="text-foreground">Item</Label>
            <Input
              id="item"
              placeholder="e.g., Lunch, Movie tickets"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="bg-background/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidBy" className="text-foreground">Who Paid?</Label>
            <Select value={paidBy} onValueChange={(value) => setPaidBy(value as 'Me' | 'Friend')}>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Me">Me</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paidBy === 'Friend' && (
            <div className="space-y-2">
              <Label htmlFor="friend" className="text-foreground">Select Friend</Label>
              <Select value={friendId} onValueChange={setFriendId}>
                <SelectTrigger className="bg-background/50 border-white/10">
                  <SelectValue placeholder="Choose a friend" />
                </SelectTrigger>
                <SelectContent>
                  {friends?.map((friend) => (
                    <SelectItem key={friend.id.toString()} value={friend.id.toString()}>
                      {friend.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
              disabled={addExpense.isPending}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white"
            >
              {addExpense.isPending ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
