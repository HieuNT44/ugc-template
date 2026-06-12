import { clientApiRequest } from "../client/fetch-api";
import {
  MAX_IMAGE_UPLOAD_BYTES,
  UPLOAD_PART_SIZE,
} from "../constants/upload-limits";
import { UploadServiceError } from "../lib/upload-error";
import type {
  CompleteUploadPart,
  CompleteUploadPayload,
  InitiateUploadPayload,
  UploadFileCompleted,
  UploadFileInitiated,
  UploadUrlPart,
} from "../types";
import type { AppLanguage, UploadType } from "../types/enums";

const EXTENSION_MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  heic: "image/heic",
  heif: "image/heif",
};

function inferImageMimeType(file: File): string {
  if (file.type.startsWith("image/")) {
    return file.type;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_MIME_MAP[extension] ?? "";
}

/** Step 0 — client validation before initiate. */
export function validateImage(file: File): { mimeType: string } {
  const mimeType = inferImageMimeType(file);

  if (!mimeType.startsWith("image/")) {
    throw new UploadServiceError(
      "画像ファイルのみアップロードできます",
      "validate",
      "not_image"
    );
  }

  if (file.size <= 0) {
    throw new UploadServiceError(
      "選択したファイルが空です",
      "validate",
      "empty"
    );
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new UploadServiceError(
      "画像は10MB以下にしてください",
      "validate",
      "too_large"
    );
  }

  return { mimeType };
}

function splitFile(file: File): Blob[] {
  const parts: Blob[] = [];
  for (let offset = 0; offset < file.size; offset += UPLOAD_PART_SIZE) {
    parts.push(file.slice(offset, offset + UPLOAD_PART_SIZE));
  }
  return parts;
}

/** Step 1 — initiate upload metadata (JSON + Bearer). */
export async function initiateUpload(
  file: File,
  uploadType: UploadType,
  token: string,
  language?: AppLanguage
): Promise<UploadFileInitiated> {
  const { mimeType } = validateImage(file);

  const payload: InitiateUploadPayload = {
    upload_type: uploadType,
    name: file.name,
    mime_type: mimeType,
    size: file.size,
  };

  const result = await clientApiRequest<UploadFileInitiated>({
    path: "/upload-files",
    method: "POST",
    token,
    body: payload,
    language,
  });

  if (!result.ok) {
    throw new UploadServiceError(
      result.error.message,
      "initiate",
      result.error.code
    );
  }

  return result.data;
}

/** Step 2 — PUT file parts to presigned S3 URLs (no Bearer). */
export async function uploadPartsToS3(
  file: File,
  uploadUrls: UploadUrlPart[],
  mimeType: string
): Promise<CompleteUploadPart[]> {
  const blobs = splitFile(file);

  if (blobs.length !== uploadUrls.length) {
    throw new UploadServiceError(
      "クライアントとサーバーのパート数が一致しません",
      "s3",
      "part_mismatch"
    );
  }

  try {
    return await Promise.all(
      uploadUrls.map(async (part) => {
        const blob = blobs[part.part_number - 1];
        const response = await fetch(part.url, {
          method: "PUT",
          headers: { "Content-Type": mimeType },
          body: blob,
        });

        if (!response.ok) {
          throw new UploadServiceError(
            `S3 upload failed: ${response.status}`,
            "s3",
            "s3_put_failed"
          );
        }

        const etag = response.headers.get("ETag");
        if (!etag) {
          throw new UploadServiceError(
            "S3レスポンスにETagヘッダーがありません",
            "s3",
            "missing_etag"
          );
        }

        return { part_number: part.part_number, etag };
      })
    );
  } catch (error) {
    if (error instanceof UploadServiceError) {
      throw error;
    }

    throw new UploadServiceError(
      error instanceof Error ? error.message : "S3アップロードに失敗しました",
      "s3",
      "s3_network_error"
    );
  }
}

/** Step 3 — complete multipart upload. */
export async function completeUpload(
  uploadFileId: string,
  uploadId: string,
  parts: CompleteUploadPart[],
  token: string,
  language?: AppLanguage
): Promise<UploadFileCompleted> {
  const payload: CompleteUploadPayload = {
    upload_id: uploadId,
    parts,
  };

  const result = await clientApiRequest<UploadFileCompleted>({
    path: `/upload-files/${uploadFileId}/complete`,
    method: "POST",
    token,
    body: payload,
    language,
  });

  if (!result.ok) {
    throw new UploadServiceError(
      result.error.message,
      "complete",
      result.error.code
    );
  }

  return result.data;
}

/**
 * Full client upload flow: validate → initiate → S3 PUT → complete.
 * Step 4 (attach upload_file_id to a resource) is caller-specific.
 */
export async function uploadImage(
  file: File,
  uploadType: UploadType,
  token: string,
  language?: AppLanguage
): Promise<UploadFileCompleted> {
  const { mimeType } = validateImage(file);
  const initiated = await initiateUpload(file, uploadType, token, language);
  const parts = await uploadPartsToS3(file, initiated.upload_urls, mimeType);

  return completeUpload(
    initiated.upload_file_id,
    initiated.upload_id,
    parts,
    token,
    language
  );
}
