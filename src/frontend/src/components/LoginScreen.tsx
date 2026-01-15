import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export default function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 blur-2xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-zinc-900 to-black shadow-2xl ring-1 ring-white/10">
              <Wallet className="h-12 w-12 text-white" strokeWidth={1.5} />
              <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">My Expenses</h1>
          <p className="text-lg text-muted-foreground">Your luxury financial truth assistant</p>
        </div>

        <div className="space-y-4 pt-8">
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-xl hover:shadow-orange-500/30"
          >
            {isLoggingIn ? 'Connecting...' : 'Login to Continue'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Secure authentication powered by Internet Identity
          </p>
        </div>
      </div>
    </div>
  );
}
