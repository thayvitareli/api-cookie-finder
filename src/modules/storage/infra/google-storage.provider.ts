import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';
import {
  IStorageProvider,
  UploadImageInput,
  UploadImageResult,
} from '../domain/provider/storage.provider.interface';

@Injectable()
export class GoogleStorageProvider implements IStorageProvider {
  private getBucket() {
    const storageBucket = process.env.GOOGLE_STORAGE_BUCKET;
    if (!storageBucket) {
      throw new Error('GOOGLE_STORAGE_BUCKET is not set');
    }

    if (!admin.apps.length) {
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      const credential = credentialsPath
        ? admin.credential.cert(
            JSON.parse(
              fs.readFileSync(
                path.isAbsolute(credentialsPath)
                  ? credentialsPath
                  : path.resolve(process.cwd(), credentialsPath),
                'utf8',
              ),
            ),
          )
        : admin.credential.applicationDefault();

      admin.initializeApp({
        credential,
        storageBucket,
      });
    }

    return admin.storage().bucket(storageBucket);
  }

  private buildPath(filename: string, folder?: string) {
    const safeFolder = folder?.trim() ? folder.trim().replace(/\/+$/g, '') : 'images';
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

    if (input.makePublic) {
      await file.makePublic();
      return { path, url: file.publicUrl() };
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });

    return { path, url };
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
