import type { User } from "./user";

export interface AppSession {
  user: User;
  expires: Date;
  accessToken: string;
}
