import { FieldValue } from "firebase-admin/firestore";

import { USERS_COLLECTION } from "@/core/lib/firebase";
import { getAdminDb } from "@/core/lib/firebase-admin";
import { DEFAULT_USER_ROLE } from "@/features/auth/config";
import type { User, UserRole, UserStatus } from "@/features/auth/types";

interface FirestoreUserDoc {
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

function mapDocToUser(id: string, data: FirestoreUserDoc): User {
  return {
    id,
    email: data.email,
    name: data.name,
    avatar: data.avatar,
    role: data.role,
    status: data.status,
    emailVerified: data.emailVerified,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}

export async function getUserById(uid: string): Promise<User | null> {
  const snapshot = await getAdminDb()
    .collection(USERS_COLLECTION)
    .doc(uid)
    .get();
  if (!snapshot.exists) {
    return null;
  }
  return mapDocToUser(snapshot.id, snapshot.data() as FirestoreUserDoc);
}

export async function createUserProfile(input: {
  uid: string;
  email: string;
  name: string;
  role?: UserRole;
  emailVerified?: boolean;
}): Promise<User> {
  const doc = {
    email: input.email,
    name: input.name,
    role: input.role ?? DEFAULT_USER_ROLE,
    status: "active" as const,
    emailVerified: input.emailVerified ?? false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await getAdminDb().collection(USERS_COLLECTION).doc(input.uid).set(doc);

  const created = await getUserById(input.uid);
  if (!created) {
    throw new Error("Failed to create user profile");
  }
  return created;
}

export async function ensureUserProfile(input: {
  uid: string;
  email: string;
  name: string;
  emailVerified?: boolean;
}): Promise<User> {
  const existing = await getUserById(input.uid);
  if (existing) {
    return existing;
  }
  return createUserProfile(input);
}
