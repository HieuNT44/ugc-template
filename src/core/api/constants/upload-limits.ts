/** Max image size for RealRead upload API (10 MB). */
export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

/** S3 multipart part size — must match BE presigned part count. */
export const UPLOAD_PART_SIZE = 10 * 1024 * 1024;
