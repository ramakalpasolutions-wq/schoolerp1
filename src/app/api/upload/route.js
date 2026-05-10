// src/app/api/upload/route.js

import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/auth";
import { uploadFromFormData } from "../../../../lib/r2";

const ok = (data, message = "Success", status = 200) =>
  NextResponse.json({ success: true, message, data }, { status });

const err = (message = "Error", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

const FOLDER_MAP = {
  student_photo: "students/photos",
  teacher_photo: "teachers/photos",
  document: "documents",
  receipt: "fees/receipts",
  payslip: "salaries/payslips",
  homework: "homework",
  expense: "expenses/receipts",
  logo: "schools/logos",
  general: "general",
};

const MIME_WHITELIST = {
  "image/jpeg": true,
  "image/jpg": true,
  "image/png": true,
  "image/webp": true,
  "image/gif": true,
  "application/pdf": true,
  "application/msword": true,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
  "application/vnd.ms-excel": true,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": true,
};

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return err("Authentication required.", 401);

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return err("Request must be multipart/form-data.", 400);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folderKey = formData.get("folder") || "general";
    const customFilename = formData.get("filename");

    if (!file || !(file instanceof File)) {
      return err("No file provided in request.", 400);
    }

    if (file.size === 0) return err("File is empty.", 400);

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return err(
        `File too large. Maximum size is ${maxSize / 1024 / 1024}MB.`,
        400
      );
    }

    if (!MIME_WHITELIST[file.type]) {
      return err(`File type "${file.type}" is not allowed.`, 400);
    }

    const folder = FOLDER_MAP[folderKey] || FOLDER_MAP.general;

    const result = await uploadFromFormData(file, folder);

    return ok(
      {
        url: result.url,
        key: result.key,
        size: result.size,
        mimeType: result.mimeType,
        originalName: result.originalName,
        folder,
      },
      "File uploaded successfully.",
      201
    );
  } catch (error) {
    console.error("[POST /api/upload]:", error);
    return err(error.message || "Upload failed.", 500);
  }
}