import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Expense, Friend, Settlement, Summary } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Expenses Queries
export function useGetExpenses() {
  const { actor, isFetching } = useActor();

  return useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExpenses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      item: string;
      amount: number;
      date: bigint;
      paidBy: string;
      friendId: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addExpense(params.item, params.amount, params.date, params.paidBy, params.friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useUpdateExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      item: string;
      amount: number;
      date: bigint;
      paidBy: string;
      friendId: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateExpense(params.id, params.item, params.amount, params.date, params.paidBy, params.friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useDeleteExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteExpense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

// Friends Queries
export function useGetFriends() {
  const { actor, isFetching } = useActor();

  return useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFriends();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFriend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFriend(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });
}

export function useUpdateFriend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFriend(params.id, params.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });
}

export function useDeleteFriend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFriend(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

// Settlements Queries
export function useGetSettlements() {
  const { actor, isFetching } = useActor();

  return useQuery<Settlement[]>({
    queryKey: ['settlements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSettlements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSettlement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      friendId: bigint;
      amount: number;
      date: bigint;
      direction: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSettlement(params.friendId, params.amount, params.date, params.direction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useUpdateSettlement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      friendId: bigint;
      amount: number;
      date: bigint;
      direction: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSettlement(params.id, params.friendId, params.amount, params.date, params.direction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useDeleteSettlement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSettlement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

// Summary Query
export function useGetSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<Summary>({
    queryKey: ['summary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSummary();
    },
    enabled: !!actor && !isFetching,
  });
}
