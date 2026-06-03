"use client";

import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  verifyPasswordResetCode,
  type UserCredential,
} from "firebase/auth";
import { signIn, signOut } from "next-auth/react";

import { getFirebaseAuth } from "./firebase";
import { buildPasswordResetRedirectUrl } from "./emailUtils";

export async function syncFirebaseSession(
  credential: UserCredential
): Promise<{ ok: boolean; error?: string }> {
  const idToken = await credential.user.getIdToken();
  const result = await signIn("firebase", {
    idToken,
    redirect: false,
  });

  if (result?.error) {
    return { ok: false, error: result.error };
  }

  return { ok: true };
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const credential = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password
  );
  return syncFirebaseSession(credential);
}

export async function registerWithEmail(input: {
  email: string;
  password: string;
  name: string;
}): Promise<{ ok: boolean; error?: string; userId?: string }> {
  const credential = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    input.email,
    input.password
  );

  await updateProfile(credential.user, { displayName: input.name });
  await sendEmailVerification(credential.user);

  const sync = await syncFirebaseSession(credential);
  if (!sync.ok) {
    return sync;
  }

  return { ok: true, userId: credential.user.uid };
}

export async function loginWithProvider(
  providerId: "google" | "github" | "facebook"
): Promise<{ ok: boolean; error?: string }> {
  const provider =
    providerId === "google"
      ? new GoogleAuthProvider()
      : providerId === "github"
        ? new GithubAuthProvider()
        : new FacebookAuthProvider();

  const credential = await signInWithPopup(getFirebaseAuth(), provider);
  return syncFirebaseSession(credential);
}

export async function logoutClient(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
  await signOut({ redirect: false });
}

export async function sendResetPasswordEmail(email: string): Promise<void> {
  await sendPasswordResetEmail(getFirebaseAuth(), email, {
    url: buildPasswordResetRedirectUrl(),
  });
}

export async function verifyResetCode(oobCode: string): Promise<string> {
  return verifyPasswordResetCode(getFirebaseAuth(), oobCode);
}

export async function resetPasswordWithCode(
  oobCode: string,
  password: string
): Promise<void> {
  await confirmPasswordReset(getFirebaseAuth(), oobCode, password);
}
