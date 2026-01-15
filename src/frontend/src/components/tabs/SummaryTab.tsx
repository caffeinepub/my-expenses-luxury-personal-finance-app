import { useGetSummary, useGetFriends, useGetExpenses } from '../../hooks/useQueries';
import { Loader2, TrendingDown, TrendingUp, Wallet, Users } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Expense } from '../../backend';

export default function SummaryTab() {
  const { data: summary, isLoading } = useGetSummary();
  const { data: friends } = useGetFriends();
  const { data: expenses } = useGetExpenses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!summary) return null;

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  // Group expenses by month
  const expensesByMonth = expenses?.reduce((acc, expense) => {
    const date = new Date(Number(expense.date) / 1000000);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Summary</h2>
        <p className="text-sm text-muted-foreground">Your financial overview</p>
      </div>

      {/* My Summary */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">My Summary</h3>
        
        <div className="rounded-2xl bg-gradient-to-br from-card/80 to-card/40 p-6 backdrop-blur-sm border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Personal Expenses</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(summary.personalExpenses)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Total money spent on you</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-card/80 to-card/40 p-6 backdrop-blur-sm border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-red-500/10 p-3">
              <TrendingDown className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalExpenses)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Net money you lost</p>
        </div>

        {/* Breakdown */}
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="breakdown" className="rounded-xl bg-card/50 backdrop-blur-sm border border-white/5 px-4">
            <AccordionTrigger className="text-white hover:no-underline">
              View Breakdown
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {expensesByMonth && Object.entries(expensesByMonth).map(([month, monthExpenses]) => {
                const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const date = new Date(month + '-01');
                const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                
                return (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{monthName}</p>
                      <p className="text-sm font-semibold text-white">{formatCurrency(monthTotal)}</p>
                    </div>
                    <div className="space-y-1 pl-4">
                      {monthExpenses.map((expense) => {
                        const friend = friends?.find(f => f.id === expense.friendId);
                        const paidByName = expense.paidBy === 'Me' ? 'You' : friend?.name || 'Unknown';
                        return (
                          <div key={expense.id.toString()} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {expense.item} <span className="text-muted-foreground/60">by {paidByName}</span>
                            </span>
                            <span className="text-muted-foreground">{formatCurrency(expense.amount)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Friends Summary */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Friends Summary</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 p-4 backdrop-blur-sm border border-red-500/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <p className="text-xs text-red-400">Total Borrowed</p>
            </div>
            <p className="text-xl font-bold text-white">{formatCurrency(summary.totalBorrowed)}</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 p-4 backdrop-blur-sm border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <p className="text-xs text-green-400">Total Lent</p>
            </div>
            <p className="text-xl font-bold text-white">{formatCurrency(summary.totalLent)}</p>
          </div>
        </div>

        {friends && friends.length > 0 && (
          <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-white">Friend Balances</p>
            </div>
            {friends.map((friend) => {
              const balance = friend.totalBorrowed - friend.totalLent;
              const isPositive = balance > 0;
              return (
                <div key={friend.id.toString()} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{friend.name}</span>
                  <span className={`text-sm font-semibold ${isPositive ? 'text-red-400' : balance < 0 ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(balance)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
