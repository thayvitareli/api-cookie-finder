import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import {
  IStorageProvider,
  UploadImageInput,
  UploadImageResult,
} from '../domain/provider/storage.provider.interface';

@Injectable()
export class GoogleStorageProvider implements IStorageProvider {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor() {
    this.bucketName = process.env.GOOGLE_STORAGE_BUCKET ?? '';

    this.storage = new Storage({
      keyFilename: './src/modules/storage/google-cloud-keys.json',
      projectId: process.env.GOOGLE_PROJECT_ID,
    });
  }

  private getBucket() {
    return this.storage.bucket(this.bucketName);
  }

  private buildPath(filename: string, folder?: string) {
    const safeFolder = folder?.trim()
      ? folder.trim().replace(/\/+$/g, '')
      : 'images';
    const safeName = filename.replace(/\\+/g, '/').split('/').pop() ?? filename;
    return `${safeFolder}/${Date.now()}-${safeName}`;
  }

  async uploadImage(input: UploadImageInput): Promise<UploadImageResult> {
    const bucket = this.getBucket();
    const path = this.buildPath(input.filename, input.folder);
    const file = bucket.file(path);

    await file.save(input.buffer, {
      resumable: false,
      contentType: input.contentType ?? 'application/octet-stream',
    });

    return {
      path,
      url: file.publicUrl(),
    };
  }

  async getImageUrl(path: string, expiresInSeconds = 3600): Promise<string> {
    const bucket = this.getBucket();
    const file = bucket.file(path);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInSeconds * 1000,
    });

    return url;
  }

  async downloadImage(path: string): Promise<Buffer> {
    const bucket = this.getBucket();
    const file = bucket.file(path);
    const [buffer] = await file.download();
    return buffer;
  }
}
