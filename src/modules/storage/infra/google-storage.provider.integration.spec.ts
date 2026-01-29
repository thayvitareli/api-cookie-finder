import 'dotenv/config';
import { Storage } from '@google-cloud/storage';
import { GoogleStorageProvider } from './google-storage.provider';

const shouldRun = process.env.RUN_GCS_TESTS === 'true';
const bucketName = process.env.GOOGLE_STORAGE_BUCKET;

(shouldRun ? describe : describe.skip)('GoogleStorageProvider (integration)', () => {
  it('uploads, downloads, signs, and cleans up a file', async () => {
    if (!bucketName) {
      throw new Error('GOOGLE_STORAGE_BUCKET is not set');
    }

    const provider = new GoogleStorageProvider();
    const input = {
      buffer: Buffer.from('storage-test'),
      filename: 'storage-test.txt',
      contentType: 'text/plain',
      folder: 'tests',
      makePublic: false,
    };

    const { path, url } = await provider.uploadImage(input);
    expect(path).toContain('tests/');
    expect(url).toContain('https://');

    const downloaded = await provider.downloadImage(path);
    expect(downloaded.toString()).toBe('storage-test');

    const signedUrl = await provider.getImageUrl(path, 60);
    expect(signedUrl).toContain('https://');

    const storage = new Storage();
    await storage.bucket(bucketName).file(path).delete({ ignoreNotFound: true });
  });
});
