import { FieldValue } from "firebase-admin/firestore";

import {
  isFirebaseAdminConfigured,
  getAdminDb,
} from "@/core/auth/lib/firebase-admin";

import {
  POST_PURCHASES_COLLECTION,
  type PostPurchaseRecord,
} from "../types/post-purchase";

function purchaseDocId(userId: string, postId: string): string {
  return `${userId}_${postId}`;
}

export async function hasUserPurchasedPost(
  userId: string,
  postId: string
): Promise<boolean> {
  if (!isFirebaseAdminConfigured()) {
    return false;
  }

  const snapshot = await getAdminDb()
    .collection(POST_PURCHASES_COLLECTION)
    .doc(purchaseDocId(userId, postId))
    .get();

  return snapshot.exists;
}

export async function recordPostPurchase(
  record: Omit<PostPurchaseRecord, "purchasedAt">
): Promise<void> {
  if (!isFirebaseAdminConfigured()) {
    console.warn(
      "Firebase Adminが設定されていないため、投稿購入は保存されませんでした。"
    );
    return;
  }

  await getAdminDb()
    .collection(POST_PURCHASES_COLLECTION)
    .doc(purchaseDocId(record.userId, record.postId))
    .set(
      {
        userId: record.userId,
        postId: record.postId,
        stripeSessionId: record.stripeSessionId,
        amountCents: record.amountCents,
        currency: record.currency,
        purchasedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

export async function getPostPurchaseBySessionId(
  stripeSessionId: string
): Promise<PostPurchaseRecord | null> {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  const snapshot = await getAdminDb()
    .collection(POST_PURCHASES_COLLECTION)
    .where("stripeSessionId", "==", stripeSessionId)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  if (!doc) {
    return null;
  }

  const data = doc.data();
  return {
    userId: data.userId as string,
    postId: data.postId as string,
    stripeSessionId: data.stripeSessionId as string,
    amountCents: data.amountCents as number,
    currency: data.currency as string,
    purchasedAt:
      typeof data.purchasedAt?.toDate === "function"
        ? data.purchasedAt.toDate().toISOString()
        : new Date().toISOString(),
  };
}
