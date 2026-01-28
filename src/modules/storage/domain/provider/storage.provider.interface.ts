export interface UploadImageInput {
  buffer: Buffer;
  filename: string;
  contentType?: string;
  folder?: string;
  makePublic?: boolean;
}

export interface UploadImageResult {
  path: string;
  url: string;
}

export interface IStorageProvider {
  uploadImage(input: UploadImageInput): Promise<UploadImageResult>;
  getImageUrl(path: string, expiresInSeconds?: number): Promise<string>;
  downloadImage(path: string): Promise<Buffer>;
}
