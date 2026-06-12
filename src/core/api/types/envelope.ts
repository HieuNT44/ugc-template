export interface ApiDataResponse<T> {
  data: T;
}

export interface ApiMessageResponse {
  message: string;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: ValidationErrorDetail[];
}

export interface ApiErrorResponse {
  error: ApiErrorBody;
}
