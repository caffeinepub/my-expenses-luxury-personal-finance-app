import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Settlement {
    id: bigint;
    direction: string;
    date: Date_;
    friendId: bigint;
    amount: number;
}
export type Date_ = bigint;
export interface Summary {
    totalLent: number;
    friendsSummary: Array<[bigint, number]>;
    totalExpenses: number;
    totalBorrowed: number;
    personalExpenses: number;
}
export interface Expense {
    id: bigint;
    isSettled: boolean;
    date: Date_;
    item: string;
    friendId?: bigint;
    amount: number;
    paidBy: string;
}
export interface Friend {
    id: bigint;
    name: string;
    totalLent: number;
    totalBorrowed: number;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addExpense(item: string, amount: number, date: Date_, paidBy: string, friendId: bigint | null): Promise<void>;
    addFriend(name: string): Promise<bigint>;
    addSettlement(friendId: bigint, amount: number, date: Date_, direction: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteExpense(id: bigint): Promise<void>;
    deleteFriend(id: bigint): Promise<void>;
    deleteSettlement(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExpenses(): Promise<Array<Expense>>;
    getFriends(): Promise<Array<Friend>>;
    getSettlements(): Promise<Array<Settlement>>;
    getSummary(): Promise<Summary>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateExpense(id: bigint, item: string, amount: number, date: Date_, paidBy: string, friendId: bigint | null): Promise<void>;
    updateFriend(id: bigint, name: string): Promise<void>;
    updateSettlement(id: bigint, friendId: bigint, amount: number, date: Date_, direction: string): Promise<void>;
}
