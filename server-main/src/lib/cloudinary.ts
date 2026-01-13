import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const API_KEY = process.env.CLOUDINARY_API_KEY || "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

export interface SignatureParams {
  folder: string;
  publicId?: string;
  timestamp?: number;
}

export interface SignatureResult {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId?: string;
  uploadUrl: string;
}

export function generateUploadSignature(
  params: SignatureParams,
): SignatureResult {
  const timestamp = params.timestamp || Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    folder: params.folder,
    timestamp,
  };

  if (params.publicId) {
    paramsToSign.public_id = params.publicId;
  }

  const signatureString = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(signatureString + API_SECRET)
    .digest("hex");

  return {
    signature,
    timestamp,
    apiKey: API_KEY,
    cloudName: CLOUD_NAME,
    folder: params.folder,
    ...(params.publicId && { publicId: params.publicId }),
    uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
  };
}

export async function deleteCloudinaryImage(
  publicId: string,
): Promise<boolean> {
  const timestamp = Math.round(Date.now() / 1000);
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto
    .createHash("sha1")
    .update(signatureString)
    .digest("hex");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp.toString());

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
    { method: "POST", body: formData },
  );

  const result = await response.json();
  return result.result === "ok";
}

export function getPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
}

export function isValidCloudinaryUrl(url: string): boolean {
  if (!CLOUD_NAME) return false;
  return url.includes(`res.cloudinary.com/${CLOUD_NAME}`);
}

export function getOptimizedUrl(
  url: string,
  options?: { width?: number; height?: number; crop?: string },
): string {
  const transforms = ["f_auto", "q_auto"];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);

  const transformString = transforms.join(",");
  return url.replace("/upload/", `/upload/${transformString}/`);
}

export function getThumbnailUrl(url: string): string {
  return url.replace("/upload/", "/upload/c_fill,w_200,h_200,f_auto,q_auto/");
}
