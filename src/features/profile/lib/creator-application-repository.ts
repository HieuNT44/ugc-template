import { FieldValue } from "firebase-admin/firestore";

import {
  getAdminDb,
  isFirebaseAdminConfigured,
} from "@/core/auth/lib/firebase-admin";
import type { UserRole } from "@/core/auth/types";

import type {
  CreatorApplication,
  CreatorApplicationStatus,
  CreatorContentTypes,
} from "../types/creator-application";

const CREATOR_APPLICATIONS_COLLECTION = "creatorApplications";
const USERS_COLLECTION = "users";

export type SubmitCreatorApplicationInput = {
  userId: string;
  name: string;
  bio: string;
  country?: string;
  website?: string;
  topics: string[];
  contentTypes: CreatorContentTypes;
  motivation: string;
  portfolioUrl?: string;
};

export async function getCreatorApplicationByUserId(
  userId: string
): Promise<CreatorApplication | null> {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  const snapshot = await getAdminDb()
    .collection(CREATOR_APPLICATIONS_COLLECTION)
    .doc(userId)
    .get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (!data) {
    return null;
  }

  return {
    userId,
    status: data.status as CreatorApplicationStatus,
    name: data.name ?? "",
    bio: data.bio ?? "",
    country: data.country ?? null,
    website: data.website ?? null,
    topics: (data.topics as string[]) ?? [],
    contentTypes: data.contentTypes as CreatorContentTypes,
    motivation: data.motivation ?? "",
    portfolioUrl: data.portfolioUrl ?? null,
    submittedAt:
      data.submittedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  };
}

/** Saves application and auto-approves (MVP hybrid): upgrades role to creator. */
export async function submitAndApproveCreatorApplication(
  input: SubmitCreatorApplicationInput
): Promise<void> {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin is not configured");
  }

  const db = getAdminDb();
  const now = FieldValue.serverTimestamp();
  const userRef = db.collection(USERS_COLLECTION).doc(input.userId);
  const applicationRef = db
    .collection(CREATOR_APPLICATIONS_COLLECTION)
    .doc(input.userId);

  await db.runTransaction(async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists) {
      throw new Error("User profile not found");
    }

    const currentRole = userSnap.data()?.role as UserRole | undefined;
    if (currentRole === "creator") {
      throw new Error("You are already a Creator");
    }
    if (currentRole !== "reader") {
      throw new Error("Only Reader accounts can apply to become a Creator");
    }

    transaction.set(applicationRef, {
      userId: input.userId,
      status: "approved",
      name: input.name,
      bio: input.bio,
      country: input.country ?? null,
      website: input.website ?? null,
      topics: input.topics,
      contentTypes: input.contentTypes,
      motivation: input.motivation,
      portfolioUrl: input.portfolioUrl ?? null,
      submittedAt: now,
      reviewedAt: now,
    });

    transaction.update(userRef, {
      role: "creator",
      name: input.name,
      bio: input.bio,
      country: input.country ?? null,
      website: input.website ?? null,
      fields: input.topics,
      updatedAt: now,
    });
  });
}
