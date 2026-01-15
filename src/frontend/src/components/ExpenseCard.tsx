import { useState } from 'react';
import type { Expense, Friend } from '../backend';
import { Calendar, User, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditExpenseDialog from './dialogs/EditExpenseDialog';
import DeleteExpenseDialog from './dialogs/DeleteExpenseDialog';

interface ExpenseCardProps {
  expense: Expense;
  friends: Friend[];
}

export default function ExpenseCard({ expense, friends }: ExpenseCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const friend = friends.find(f => f.id === expense.friendId);
  const paidByName = expense.paidBy === 'Me' ? 'You' : friend?.name || 'Unknown';

  return (
    <>
      <div className="group rounded-2xl bg-gradient-to-br from-card/80 to-card/40 p-4 backdrop-blur-sm border border-white/5 shadow-lg transition-all hover:shadow-xl hover:border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{expense.item}</h3>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>Paid by {paidByName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(expense.date)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-xl font-bold text-white">{formatCurrency(expense.amount)}</p>
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

      <EditExpenseDialog
        expense={expense}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
      <DeleteExpenseDialog
        expense={expense}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}
