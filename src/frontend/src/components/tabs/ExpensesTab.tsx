import { useState } from 'react';
import { useGetExpenses, useGetFriends } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import ExpenseCard from '../ExpenseCard';
import AddExpenseDialog from '../dialogs/AddExpenseDialog';

export default function ExpensesTab() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: expenses, isLoading } = useGetExpenses();
  const { data: friends } = useGetFriends();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Expenses</h2>
          <p className="text-sm text-muted-foreground">Track your spending</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add
        </Button>
      </div>

      {expenses && expenses.length > 0 ? (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id.toString()} expense={expense} friends={friends || []} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted/10 p-6 mb-4">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No expenses yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Start tracking your spending</p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Expense
          </Button>
        </div>
      )}

      <AddExpenseDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
