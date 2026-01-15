import type { Friend } from '../backend';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

interface FriendCardProps {
  friend: Friend;
  onSelect: (friend: Friend) => void;
}

export default function FriendCard({ friend, onSelect }: FriendCardProps) {
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  const balance = friend.totalLent - friend.totalBorrowed;
  const isPositive = balance > 0;

  return (
    <button
      onClick={() => onSelect(friend)}
      className="w-full group rounded-2xl bg-gradient-to-br from-card/80 to-card/40 p-4 backdrop-blur-sm border border-white/5 shadow-lg transition-all hover:shadow-xl hover:border-white/10 hover:scale-[1.02] text-left"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-3">{friend.name}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-500/10 p-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lent</p>
                <p className="text-sm font-semibold text-green-400">{formatCurrency(friend.totalLent)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-red-500/10 p-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Borrowed</p>
                <p className="text-sm font-semibold text-red-400">{formatCurrency(friend.totalBorrowed)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className={`text-xl font-bold ${isPositive ? 'text-green-400' : balance < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
              {isPositive ? '+' : ''}{formatCurrency(balance)}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
        </div>
      </div>
    </button>
  );
}
