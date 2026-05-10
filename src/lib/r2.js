// lib/r2.js

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";

// ── R2 Client initialization ─────────────────────────────────────
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "school-erp";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

// ── Allowed MIME types ───────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ...ALLOWED_IMAGE_TYPES,
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Sanitize filename — remove special chars
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}

/**
 * Generate unique storage key
 */
function generateKey(folder, filename) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const sanitized = sanitizeFilename(filename);
  const ext = sanitized.split(".").pop();
  const baseName = sanitized.split(".").slice(0, -1).join(".");
  return `${folder}/${timestamp}_${random}_${baseName}.${ext}`;
}

// ══════════════════════════════════════════════════════════════════
// UPLOAD FILE
// ══════════════════════════════════════════════════════════════════

/**
 * Upload a file buffer to Cloudflare R2
 *
 * @param {Buffer|Uint8Array} fileBuffer - File content
 * @param {string} folder - Storage folder (e.g., "students", "receipts")
 * @param {string} filename - Original filename
 * @param {string} mimeType - MIME type of the file
 * @param {Object} options - { isPublic, maxSize, allowedTypes }
 * @returns {{ success, key, url, size, mimeType }}
 */
export async function uploadFile(
  fileBuffer,
  folder,
  filename,
  mimeType,
  options = {}
) {
  const {
    maxSize = MAX_FILE_SIZE,
    allowedTypes = ALLOWED_DOCUMENT_TYPES,
  } = options;

  // ── Validate ──────────────────────────────────────────────────
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error("File buffer is empty.");
  }
  if (fileBuffer.length > maxSize) {
    const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
    throw new Error(`File too large. Maximum allowed size is ${maxMB}MB.`);
  }
  if (!allowedTypes.includes(mimeType)) {
    throw new Error(
      `File type not allowed. Allowed: ${allowedTypes.join(", ")}`
    );
  }

  const key = generateKey(folder, filename);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    Metadata: {
      originalName: filename,
      uploadedAt: new Date().toISOString(),
    },
  });

  await r2Client.send(command);

  const url = PUBLIC_URL
    ? `${PUBLIC_URL}/${key}`
    : `https://${BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

  return {
    success: true,
    key,
    url,
    size: fileBuffer.length,
    mimeType,
    originalName: filename,
  };
}

/**
 * Upload from Next.js File object (FormData)
 */
export async function uploadFromFormData(file, folder) {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file object.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadFile(buffer, folder, file.name, file.type);
}

// ══════════════════════════════════════════════════════════════════
// DELETE FILE
// ══════════════════════════════════════════════════════════════════

/**
 * Delete a file from R2 by key
 */
export async function deleteFile(key) {
  if (!key) throw new Error("File key is required.");

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
  return { success: true, key };
}

/**
 * Delete multiple files
 */
export async function deleteFiles(keys = []) {
  const results = await Promise.allSettled(keys.map((key) => deleteFile(key)));

  return {
    success: true,
    deleted: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
    errors: results
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason?.message),
  };
}

// ══════════════════════════════════════════════════════════════════
// SIGNED URL (for private files)
// ══════════════════════════════════════════════════════════════════

/**
 * Generate a pre-signed URL for temporary file access
 * @param {string} key - File key in R2
 * @param {number} expiresIn - Seconds until expiry (default: 1 hour)
 */
export async function getSignedUrl(key, expiresIn = 3600) {
  if (!key) throw new Error("File key is required.");

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const url = await awsGetSignedUrl(r2Client, command, { expiresIn });
  return { success: true, url, expiresIn };
}

/**
 * Get public URL from key (for public buckets)
 */
export function getPublicUrl(key) {
  if (!key) return null;
  return PUBLIC_URL
    ? `${PUBLIC_URL}/${key}`
    : `https://${BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
}

/**
 * Extract key from a public URL
 */
export function extractKeyFromUrl(url) {
  if (!url || !PUBLIC_URL) return null;
  return url.replace(`${PUBLIC_URL}/`, "");
}