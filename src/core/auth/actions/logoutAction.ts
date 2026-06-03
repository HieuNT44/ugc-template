"use server";

export async function logoutAction(): Promise<{
  success: true;
  redirectTo: string;
}> {
  return {
    success: true,
    redirectTo: "/login",
  };
}
