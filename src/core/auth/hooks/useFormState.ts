"use client";

import { useState } from "react";

export function useFormState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const startSubmit = () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const setErrorMessage = (message: string) => {
    setError(message);
    setSuccess(null);
    setIsLoading(false);
  };

  const setSuccessMessage = (message: string) => {
    setSuccess(message);
    setError(null);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    success,
    startSubmit,
    setLoading,
    setError: setErrorMessage,
    setSuccess: setSuccessMessage,
  };
}
