import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-zinc-900 to-black shadow-2xl ring-1 ring-white/10">
                <Wallet className="h-10 w-10 text-white" strokeWidth={1.5} />
                <div className="absolute bottom-2 right-2 h-3 w-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome!</h1>
          <p className="mt-2 text-muted-foreground">Let's set up your profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-card/50 backdrop-blur-sm border-white/10"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-xl hover:shadow-orange-500/30"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? 'Creating Profile...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
