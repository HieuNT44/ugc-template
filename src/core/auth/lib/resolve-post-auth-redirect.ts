import { getProfileClient } from "@/core/api/client/profile-client";
import type { OnboardingStep } from "@/core/api/types/enums";
import type { UserRole } from "@/core/auth/types";

import { getRedirectUrl, shouldRequireOnboarding } from "./authUtils";

function readOnboardingStep(profile: unknown): OnboardingStep | undefined {
  if (
    typeof profile === "object" &&
    profile !== null &&
    "onboarding_step" in profile &&
    typeof (profile as { onboarding_step: unknown }).onboarding_step ===
      "string"
  ) {
    return (profile as { onboarding_step: OnboardingStep }).onboarding_step;
  }

  return undefined;
}

export async function resolvePostAuthRedirect(
  accessToken: string,
  role: UserRole
): Promise<string> {
  const profileResult = await getProfileClient(accessToken);

  if (!profileResult.ok) {
    return getRedirectUrl(role);
  }

  const step = readOnboardingStep(profileResult.data);

  if (shouldRequireOnboarding(role, step)) {
    return "/onboarding";
  }

  return getRedirectUrl(role);
}
