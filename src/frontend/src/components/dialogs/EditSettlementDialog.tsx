import { useState, useEffect } from 'react';
import { useUpdateSettlement, useGetFriends } from '../../hooks/useQueries';
import type { Settlement } from '../../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface EditSettlementDialogProps {
  settlement: Settlement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditSettlementDialog({ settlement, open, onOpenChange }: EditSettlementDialogProps) {
  const [friendId, setFriendId] = useState(settlement.friendId.toString());
  const [amount, setAmount] = useState(settlement.amount.toString());
  const [date, setDate] = useState('');
  const [direction, setDirection] = useState<'PaidToMe' | 'PaidByMe'>(settlement.direction as 'PaidToMe' | 'PaidByMe');

  const updateSettlement = useUpdateSettlement();
  const { data: friends } = useGetFriends();

  useEffect(() => {
    if (open) {
      setFriendId(settlement.friendId.toString());
      setAmount(settlement.amount.toString());
      const settlementDate = new Date(Number(settlement.date) / 1000000);
      setDate(settlementDate.toISOString().split('T')[0]);
      setDirection(settlement.direction as 'PaidToMe' | 'PaidByMe');
    }
  }, [open, settlement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!friendId || !amount || parseFloat(amount) <= 0) {
      toast.error('Please fill all fields correctly');
      return;
    }

    try {
      const dateTimestamp = BigInt(new Date(date).getTime() * 1000000);
      await updateSettlement.mutateAsync({
        id: settlement.id,
        friendId: BigInt(friendId),
        amount: parseFloat(amount),
        date: dateTimestamp,
        direction,
      });

      toast.success('Settlement updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update settlement');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Settlement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="friend" className="text-foreground">Friend</Label>
            <Select value={friendId} onValueChange={setFriendId}>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue />
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

          <div className="space-y-2">
            <Label htmlFor="direction" className="text-foreground">Payment Direction</Label>
            <Select value={direction} onValueChange={(value) => setDirection(value as 'PaidToMe' | 'PaidByMe')}>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PaidToMe">Friend paid me</SelectItem>
                <SelectItem value="PaidByMe">I paid friend</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={updateSettlement.isPending}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white"
            >
              {updateSettlement.isPending ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
