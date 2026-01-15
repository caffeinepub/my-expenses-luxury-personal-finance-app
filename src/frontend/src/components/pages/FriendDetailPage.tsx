import { useState } from 'react';
import type { Friend, Expense, Settlement } from '../../backend';
import { useGetExpenses, useGetSettlements, useUpdateFriend, useDeleteFriend } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AddTransactionDialog from '../dialogs/AddTransactionDialog';
import EditTransactionDialog from '../dialogs/EditTransactionDialog';
import DeleteTransactionDialog from '../dialogs/DeleteTransactionDialog';
import EditFriendDialog from '../dialogs/EditFriendDialog';
import DeleteFriendDialog from '../dialogs/DeleteFriendDialog';

interface FriendDetailPageProps {
  friend: Friend;
  onBack: () => void;
}

type Transaction = {
  id: bigint;
  type: 'borrowed' | 'lent';
  item: string;
  amount: number;
  date: bigint;
  source: 'expense' | 'settlement';
};

export default function FriendDetailPage({ friend, onBack }: FriendDetailPageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isEditFriendOpen, setIsEditFriendOpen] = useState(false);
  const [isDeleteFriendOpen, setIsDeleteFriendOpen] = useState(false);

  const { data: expenses, isLoading: expensesLoading } = useGetExpenses();
  const { data: settlements, isLoading: settlementsLoading } = useGetSettlements();

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const balance = friend.totalLent - friend.totalBorrowed;
  const isPositive = balance > 0;

  // Combine expenses and settlements into transactions
  const transactions: Transaction[] = [];

  // Add lent transactions (expenses where I paid for friend)
  if (expenses) {
    const friendExpenses = expenses.filter(exp => exp.friendId === friend.id && exp.paidBy === 'Me');
    friendExpenses.forEach(exp => {
      transactions.push({
        id: exp.id,
        type: 'lent',
        item: exp.item,
        amount: exp.amount,
        date: exp.date,
        source: 'expense',
      });
    });
  }

  // Add borrowed transactions (settlements where friend paid me back)
  if (settlements) {
    const friendSettlements = settlements.filter(s => s.friendId === friend.id);
    friendSettlements.forEach(settlement => {
      transactions.push({
        id: settlement.id,
        type: 'borrowed',
        item: settlement.direction === 'PaidToMe' ? 'Payment received' : 'Payment made',
        amount: settlement.amount,
        date: settlement.date,
        source: 'settlement',
      });
    });
  }

  // Sort by date descending
  transactions.sort((a, b) => Number(b.date - a.date));

  const isLoading = expensesLoading || settlementsLoading;

  const handleDeleteFriendSuccess = () => {
    toast.success('Friend deleted successfully!');
    onBack();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-white">{friend.name}</h1>
              <p className="text-xs text-muted-foreground">Transaction History</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditFriendOpen(true)}
              className="text-muted-foreground hover:text-white"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteFriendOpen(true)}
              className="text-muted-foreground hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Balance Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 border border-green-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-green-500/20 p-1.5">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-xs text-green-400 font-medium">Lent</p>
              </div>
              <p className="text-xl font-bold text-white">{formatCurrency(friend.totalLent)}</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 p-4 border border-red-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-red-500/20 p-1.5">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                </div>
                <p className="text-xs text-red-400 font-medium">Borrowed</p>
              </div>
              <p className="text-xl font-bold text-white">{formatCurrency(friend.totalBorrowed)}</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-card/80 to-card/40 p-4 border border-white/10 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Balance</p>
              <p className={`text-xl font-bold ${isPositive ? 'text-green-400' : balance < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                {isPositive ? '+' : ''}{formatCurrency(balance)}
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Transactions</h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={`${transaction.source}-${transaction.id.toString()}`}
                    className="rounded-2xl bg-gradient-to-br from-card/80 to-card/40 p-4 backdrop-blur-sm border border-white/5 shadow-lg transition-all hover:border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`rounded-full p-1.5 ${transaction.type === 'lent' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            {transaction.type === 'lent' ? (
                              <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                            )}
                          </div>
                          <span className={`text-xs font-medium ${transaction.type === 'lent' ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.type === 'lent' ? 'Lent' : 'Borrowed'}
                          </span>
                        </div>
                        <p className="text-base font-semibold text-white mb-1">{transaction.item}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className={`text-lg font-bold ${transaction.type === 'lent' ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-white"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-400"
                            onClick={() => setDeletingTransaction(transaction)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-white/5">
                <div className="rounded-full bg-muted/10 p-6 mb-4">
                  <TrendingDown className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No transactions yet</h3>
                <p className="text-sm text-muted-foreground">Add a transaction to get started</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:scale-110"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Dialogs */}
      <AddTransactionDialog
        friend={friend}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          friend={friend}
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
        />
      )}

      {deletingTransaction && (
        <DeleteTransactionDialog
          transaction={deletingTransaction}
          open={!!deletingTransaction}
          onOpenChange={(open) => !open && setDeletingTransaction(null)}
        />
      )}

      <EditFriendDialog
        friend={friend}
        open={isEditFriendOpen}
        onOpenChange={setIsEditFriendOpen}
      />

      <DeleteFriendDialog
        friend={friend}
        open={isDeleteFriendOpen}
        onOpenChange={setIsDeleteFriendOpen}
        onSuccess={handleDeleteFriendSuccess}
      />
    </div>
  );
}
