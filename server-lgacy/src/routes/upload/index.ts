import { Hono } from "hono";
import { getCurrentUser } from "../../lib/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
} from "../../middleware/response";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { generateUploadSignature } from "../../lib/cloudinary";

const app = new Hono();

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "10485760"); // 10MB default
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"];

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const SUBDIRS = ["avatars", "products", "vendors", "documents", "temp"];
SUBDIRS.forEach((subdir) => {
  const subdirPath = path.join(UPLOAD_DIR, subdir);
  if (!fs.existsSync(subdirPath)) {
    fs.mkdirSync(subdirPath, { recursive: true });
  }
});

function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  return `${timestamp}-${randomString}${ext}`;
}

function getFileCategory(type?: string): string {
  if (!type) return "temp";

  if (type === "avatar" || type === "profile") return "avatars";
  if (type === "product") return "products";
  if (type === "vendor" || type === "logo" || type === "cover")
    return "vendors";
  if (type === "document" || type === "kyc") return "documents";

  return "temp";
}

app.post("/cloudinary/signature", async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, "Not authenticated");
    }

    const body = await c.req.json().catch(() => ({}));
    const { type = "dish", filename } = body;

    let folder = "drop/misc";

    if (user.type === "vendor") {
      if (type === "dish" || type === "product") {
        folder = `drop/vendors/${user.userId}/dishes`;
      } else if (type === "logo") {
        folder = `drop/vendors/${user.userId}/logo`;
      } else if (type === "cover") {
        folder = `drop/vendors/${user.userId}/cover`;
      } else {
        folder = `drop/vendors/${user.userId}/misc`;
      }
    } else if (user.type === "user") {
      folder = `drop/users/${user.userId}`;
    } else if (user.type === "rider") {
      folder = `drop/riders/${user.userId}`;
    }

    const cleanFilename = filename
      ? filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_")
      : "img";
    const publicId = `${Date.now()}_${cleanFilename}`;

    const signatureData = generateUploadSignature({ folder, publicId });

    return successResponse(c, signatureData, "Signature generated");
  } catch (error) {
    console.error("Cloudinary signature error:", error);
    return errorResponse(c, "Failed to generate signature", 500);
  }
});

app.post("/", async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, "Not authenticated");
    }

    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "temp";
    const allowedTypes = (formData.get("allowedTypes") as string) || "image";

    if (!file) {
      return badRequestResponse(c, "No file uploaded");
    }

    if (file.size > MAX_FILE_SIZE) {
      return badRequestResponse(
        c,
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    const fileTypes =
      allowedTypes === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_FILE_TYPES;
    if (!fileTypes.includes(file.type)) {
      return badRequestResponse(
        c,
        `Invalid file type. Allowed types: ${fileTypes.join(", ")}`,
      );
    }

    const category = getFileCategory(type);
    const uploadPath = path.join(UPLOAD_DIR, category);

    const filename = generateUniqueFilename(file.name);
    const filepath = path.join(uploadPath, filename);

    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));

    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    const fileUrl = `${baseUrl}/uploads/${category}/${filename}`;

    return successResponse(
      c,
      {
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        category,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      },
      "File uploaded successfully",
      201,
    );
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse(c, "Failed to upload file", 500);
  }
});

app.post("/multiple", async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, "Not authenticated");
    }

    const formData = await c.req.formData();
    const files = formData.getAll("files") as File[];
    const type = (formData.get("type") as string) || "temp";
    const allowedTypes = (formData.get("allowedTypes") as string) || "image";

    if (!files || files.length === 0) {
      return badRequestResponse(c, "No files uploaded");
    }

    const maxFiles = parseInt(process.env.MAX_FILES_PER_UPLOAD || "10");
    if (files.length > maxFiles) {
      return badRequestResponse(
        c,
        `Cannot upload more than ${maxFiles} files at once`,
      );
    }

    const fileTypes =
      allowedTypes === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_FILE_TYPES;
    const category = getFileCategory(type);
    const uploadPath = path.join(UPLOAD_DIR, category);
    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;

    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        if (file.size > MAX_FILE_SIZE) {
          errors.push({
            filename: file.name,
            error: `File size exceeds maximum allowed size`,
          });
          continue;
        }

        if (!fileTypes.includes(file.type)) {
          errors.push({
            filename: file.name,
            error: `Invalid file type`,
          });
          continue;
        }

        const filename = generateUniqueFilename(file.name);
        const filepath = path.join(uploadPath, filename);

        const buffer = await file.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));

        const fileUrl = `${baseUrl}/uploads/${category}/${filename}`;

        uploadedFiles.push({
          filename,
          originalName: file.name,
          size: file.size,
          type: file.type,
          category,
          url: fileUrl,
        });
      } catch (error) {
        errors.push({
          filename: file.name,
          error: "Failed to upload file",
        });
      }
    }

    return successResponse(
      c,
      {
        uploaded: uploadedFiles,
        errors: errors.length > 0 ? errors : undefined,
        totalUploaded: uploadedFiles.length,
        totalErrors: errors.length,
      },
      `${uploadedFiles.length} file(s) uploaded successfully`,
      201,
    );
  } catch (error) {
    console.error("Multiple upload error:", error);
    return errorResponse(c, "Failed to upload files", 500);
  }
});

app.delete("/:category/:filename", async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, "Not authenticated");
    }

    const category = c.req.param("category");
    const filename = c.req.param("filename");

    if (!SUBDIRS.includes(category)) {
      return badRequestResponse(c, "Invalid category");
    }

    const filepath = path.join(UPLOAD_DIR, category, filename);

    if (!fs.existsSync(filepath)) {
      return errorResponse(c, "File not found", 404, "Not Found");
    }

    fs.unlinkSync(filepath);

    return successResponse(
      c,
      { filename, category },
      "File deleted successfully",
    );
  } catch (error) {
    console.error("Delete file error:", error);
    return errorResponse(c, "Failed to delete file", 500);
  }
});
export default app;
