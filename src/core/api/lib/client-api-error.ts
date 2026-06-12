import type { ClientApiError } from "../client/fetch-api";

export class ClientApiRequestError extends Error {
  readonly apiError: ClientApiError;

  constructor(apiError: ClientApiError) {
    super(apiError.message);
    this.name = "ClientApiRequestError";
    this.apiError = apiError;
  }
}

export function toClientApiRequestError(
  error: ClientApiError
): ClientApiRequestError {
  return new ClientApiRequestError(error);
}
