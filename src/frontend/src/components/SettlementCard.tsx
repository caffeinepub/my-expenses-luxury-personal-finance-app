import { useState } from 'react';
import type { Settlement, Friend } from '../backend';
import { Calendar, ArrowRight, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditSettlementDialog from './dialogs/EditSettlementDialog';
import DeleteSettlementDialog from './dialogs/DeleteSettlementDialog';

interface SettlementCardProps {
  settlement: Settlement;
  friends: Friend[];
}

export default function SettlementCard({ settlement, friends }: SettlementCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const friend = friends.find(f => f.id === settlement.friendId);
  const isPaidToMe = settlement.direction === 'PaidToMe';

  return (
    <>
      <div className="group rounded-2xl bg-gradient-to-br from-card/80 to-card/40 p-4 backdrop-blur-sm border border-white/5 shadow-lg transition-all hover:shadow-xl hover:border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isPaidToMe ? (
                <div className="rounded-full bg-green-500/10 p-2">
                  <ArrowLeft className="h-4 w-4 text-green-400" />
                </div>
              ) : (
                <div className="rounded-full bg-blue-500/10 p-2">
                  <ArrowRight className="h-4 w-4 text-blue-400" />
                </div>
              )}
              <div>
                <h3 className="text-base font-semibold text-white">
                  {isPaidToMe ? `${friend?.name || 'Unknown'} paid you` : `You paid ${friend?.name || 'Unknown'}`}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(settlement.date)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className={`text-xl font-bold ${isPaidToMe ? 'text-green-400' : 'text-blue-400'}`}>
              {formatCurrency(settlement.amount)}
            </p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-white"
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-400"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EditSettlementDialog
        settlement={settlement}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
      <DeleteSettlementDialog
        settlement={settlement}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}
