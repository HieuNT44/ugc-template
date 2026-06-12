import type { ClientApiResult } from "@/core/api/client/fetch-api";
import type { AuthToken } from "@/core/api/types";

import { createAuthSessionSuccess } from "./create-auth-session-result";
import { mapApiAuthFailure } from "./map-api-auth-error";
import type { AuthSessionResponse } from "../types";

export function resolveAuthTokenResult(
  result: ClientApiResult<AuthToken>
): AuthSessionResponse {
  if (!result.ok) {
    return { success: false, ...mapApiAuthFailure(result.error) };
  }

  return createAuthSessionSuccess(result.data);
}
