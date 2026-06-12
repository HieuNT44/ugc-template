export {
  apiConfig,
  getApiBaseUrl,
  getDefaultApiHeaders,
} from "./config/api.config";

export { API_ERROR_CODES, type ApiErrorCode } from "./constants/error-codes";
export { API_VALIDATION_LIMITS } from "./constants/validation-limits";

export {
  apiFailure,
  apiMessageFailure,
  apiMessageSuccess,
  apiSuccess,
  type ApiClientError,
  type ApiMessageResult,
  type ApiResult,
} from "./lib/api-result";

export {
  createNetworkError,
  isUnauthorizedError,
  isValidationError,
  parseApiError,
} from "./lib/parse-api-error";

export { mapValidationErrorsToFields } from "./lib/map-validation-errors";

export { useUploadImage } from "./hooks/useUploadImage";
export { useProfileOverviewQuery } from "./hooks/use-profile-overview-query";
export { useUpdateProfileMutation } from "./hooks/use-update-profile-mutation";
export {
  useProfileSettingsQuery,
  useUpdateProfileSettingsMutation,
} from "./hooks/use-profile-settings-query";
export {
  useExperiencesQuery,
  useSyncExperiencesMutation,
  useEducationsQuery,
  useSyncEducationsMutation,
  useCertificationsQuery,
  useSyncCertificationsMutation,
  useAccomplishmentsQuery,
  useSyncAccomplishmentsMutation,
} from "./hooks/use-profile-cv-queries";
export { useChangePasswordMutation } from "./hooks/use-change-password-mutation";
export { ApiQueryProvider } from "./providers/ApiQueryProvider";
export { queryKeys } from "./query/query-keys";
export { apiAxios } from "./client/axios-instance";
export {
  uploadImage,
  initiateUpload,
  uploadPartsToS3,
  completeUpload,
  validateImage,
} from "./services/upload.service";
export { UploadServiceError, toUploadUserMessage } from "./lib/upload-error";
export { getUploadMessage } from "./lib/upload-messages";
export {
  clientApiRequest,
  type ClientApiResult,
  type ClientApiError,
} from "./client/fetch-api";

export type * from "./types";

export {
  getProfile,
  updateProfile,
  getProfileSettings,
  updateProfileSettings,
  getExperiences,
  syncExperiences,
  getEducations,
  syncEducations,
  getCertifications,
  syncCertifications,
  getAccomplishments,
  syncAccomplishments,
} from "./endpoints/profile";
