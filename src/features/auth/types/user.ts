export type UserRole = "admin" | "creator" | "reader" | "staff";

export type UserStatus = "active" | "banned" | "pending";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GuestRole = "guest";

export type Role = UserRole | GuestRole;
