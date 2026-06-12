/**
 * Server-only API exports — use in Server Actions and Route Handlers (BFF).
 */
export {
  apiRequest,
  apiMessageRequest,
  withClientMetadata,
  type ApiRequestMethod,
  type ApiRequestOptions,
} from "./lib/api-client";
