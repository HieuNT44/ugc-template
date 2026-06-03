"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { getFirebaseAuth } from "@/core/auth/lib/firebase";
import { loginAction } from "@/core/auth/actions/loginAction";
import type { LoginFormData } from "@/core/auth/validations";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        data.email,
        data.password
      );
      const idToken = await credential.user.getIdToken();
      const authResult = await signIn("firebase", {
        idToken,
        redirect: false,
      });

      if (authResult?.error) {
        setError(authResult.error);
        return { success: false as const, error: authResult.error };
      }

      const actionResult = await loginAction(data, idToken);
      if (!actionResult.success) {
        setError(actionResult.error);
      }
      return actionResult;
    } catch {
      const message = "Invalid email or password";
      setError(message);
      return { success: false as const, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: login, isLoading, error };
}
