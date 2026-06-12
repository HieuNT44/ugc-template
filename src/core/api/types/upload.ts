import type { UploadType } from "./enums";

export interface InitiateUploadPayload {
  upload_type: UploadType;
  name: string;
  mime_type: string;
  size: number;
}

export interface UploadUrlPart {
  part_number: number;
  url: string;
}

export interface UploadFileInitiated {
  upload_file_id: string;
  upload_id: string;
  upload_urls: UploadUrlPart[];
  hash: string;
  name: string;
  expires_at: string;
}

export interface CompleteUploadPart {
  part_number: number;
  etag: string;
}

export interface CompleteUploadPayload {
  upload_id: string;
  parts: CompleteUploadPart[];
}

export interface UploadFileCompleted {
  upload_file_id: string;
  status: string;
  url: string | null;
  cdn_path: string;
  name: string;
}
