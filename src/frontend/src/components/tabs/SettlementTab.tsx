import { useState } from 'react';
import { useGetSettlements, useGetFriends } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import SettlementCard from '../SettlementCard';
import AddSettlementDialog from '../dialogs/AddSettlementDialog';

export default function SettlementTab() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: settlements, isLoading } = useGetSettlements();
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
          <h2 className="text-2xl font-bold text-white">Settlement</h2>
          <p className="text-sm text-muted-foreground">Manage repayments</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
          disabled={!friends || friends.length === 0}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add
        </Button>
      </div>

      {settlements && settlements.length > 0 ? (
        <div className="space-y-3">
          {settlements.map((settlement) => (
            <SettlementCard key={settlement.id.toString()} settlement={settlement} friends={friends || []} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted/10 p-6 mb-4">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No settlements yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Record repayments with friends</p>
          {friends && friends.length > 0 && (
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Settlement
            </Button>
          )}
        </div>
      )}

      <AddSettlementDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
