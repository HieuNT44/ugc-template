import { FieldValue } from "firebase-admin/firestore";

import { USERS_COLLECTION } from "./firebase";
import { getAdminDb } from "./firebase-admin";
import { DEFAULT_USER_ROLE } from "../config";
import type { User, UserRole, UserStatus } from "../types";

interface FirestoreUserDoc {
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  bio?: string;
  phone?: string;
  country?: string;
  website?: string;
  company?: string;
  department?: string;
  position?: string;
  verifyExpert?: boolean;
  fields?: string[];
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
    throw new Error("ユーザープロフィールを作成できませんでした");
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

export type UpdateUserProfileInput = {
  name?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  country?: string;
  website?: string;
  company?: string;
  department?: string;
  position?: string;
};

export async function updateUserProfile(
  uid: string,
  input: UpdateUserProfileInput
): Promise<User> {
  const updates: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (input.name !== undefined) updates.name = input.name;
  if (input.avatar !== undefined) updates.avatar = input.avatar;
  if (input.bio !== undefined) updates.bio = input.bio;
  if (input.phone !== undefined) updates.phone = input.phone;
  if (input.country !== undefined) updates.country = input.country;
  if (input.website !== undefined) updates.website = input.website;
  if (input.company !== undefined) updates.company = input.company;
  if (input.department !== undefined) updates.department = input.department;
  if (input.position !== undefined) updates.position = input.position;

  await getAdminDb().collection(USERS_COLLECTION).doc(uid).update(updates);

  const updated = await getUserById(uid);
  if (!updated) {
    throw new Error("ユーザープロフィールを更新できませんでした");
  }
  return updated;
}

export async function getUserProfileFields(uid: string) {
  const snapshot = await getAdminDb()
    .collection(USERS_COLLECTION)
    .doc(uid)
    .get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshot.data() as FirestoreUserDoc;
}
