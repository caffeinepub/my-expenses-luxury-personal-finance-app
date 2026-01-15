import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, Users, BarChart3, HandCoins, Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import type { UserProfile, Friend } from '../backend';
import ExpensesTab from './tabs/ExpensesTab';
import FriendsTab from './tabs/FriendsTab';
import SummaryTab from './tabs/SummaryTab';
import SettlementTab from './tabs/SettlementTab';
import FriendDetailPage from './pages/FriendDetailPage';

interface MainAppProps {
  userProfile: UserProfile;
}

export default function MainApp({ userProfile }: MainAppProps) {
  const [activeTab, setActiveTab] = useState('expenses');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleFriendSelect = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const handleBackFromFriend = () => {
    setSelectedFriend(null);
  };

  // If a friend is selected, show the detail page
  if (selectedFriend) {
    return <FriendDetailPage friend={selectedFriend} onBack={handleBackFromFriend} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-black shadow-lg ring-1 ring-white/10">
              <Wallet className="h-5 w-5 text-white" strokeWidth={1.5} />
              <div className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">My Expenses</h1>
              <p className="text-xs text-muted-foreground">Hi, {userProfile.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-white"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="settlement">Settlement</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="mt-0">
            <ExpensesTab />
          </TabsContent>

          <TabsContent value="friends" className="mt-0">
            <FriendsTab onFriendSelect={handleFriendSelect} />
          </TabsContent>

          <TabsContent value="summary" className="mt-0">
            <SummaryTab />
          </TabsContent>

          <TabsContent value="settlement" className="mt-0">
            <SettlementTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/90 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-around px-4">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'expenses'
                ? 'text-orange-500'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Receipt className="h-6 w-6" />
            <span className="text-xs font-medium">Expenses</span>
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'friends'
                ? 'text-orange-500'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Users className="h-6 w-6" />
            <span className="text-xs font-medium">Friends</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'summary'
                ? 'text-orange-500'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs font-medium">Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('settlement')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'settlement'
                ? 'text-orange-500'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <HandCoins className="h-6 w-6" />
            <span className="text-xs font-medium">Settlement</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
