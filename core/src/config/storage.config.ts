import { registerAs } from "@nestjs/config";

export const storageConfig = registerAs("storage", () => ({
  projectId: process.env.GCP_PROJECT_ID,
  GCSBucket: process.env.GCS_BUCKET,
  keyFilename: process.env.GCS_KEY_FILE_PATH,
  maxFileSize: process.env.MAX_FILE_SIZE,
  usersFoler: "users"
}));
