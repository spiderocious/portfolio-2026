import { getBrowserDb } from "@/lib/db";
import type { StorageBucket, VoidResult } from "./types";

function generateFileName(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  return `${crypto.randomUUID()}.${ext}`;
}

async function uploadToStorage(
  bucket: StorageBucket,
  file: File,
  fileName?: string
): Promise<{ url: string } | { error: string }> {
  const db = getBrowserDb();
  const path = fileName ?? generateFileName(file);

  const { error } = await db.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) return { error: error.message };

  const { data } = db.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function uploadProjectCover(file: File, fileName?: string) {
  return uploadToStorage("project-covers", file, fileName);
}

export async function uploadExperimentCover(file: File, fileName?: string) {
  return uploadToStorage("experiment-covers", file, fileName);
}

export async function uploadCompanyLogo(file: File, fileName?: string) {
  return uploadToStorage("company-logos", file, fileName);
}

export async function uploadAwardImage(file: File, fileName?: string) {
  return uploadToStorage("award-images", file, fileName);
}

export async function deleteFile(bucket: StorageBucket, path: string): Promise<VoidResult> {
  const db = getBrowserDb();
  const { error } = await db.storage.from(bucket).remove([path]);
  return error ? { error: error.message } : { error: null };
}
