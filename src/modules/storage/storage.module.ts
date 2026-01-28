import { Module } from '@nestjs/common';
import { GoogleStorageProvider } from './infra/google-storage.provider';

@Module({
  providers: [
    {
      provide: 'IStorageProvider',
      useClass: GoogleStorageProvider,
    },
  ],
  exports: ['IStorageProvider'],
})
export class StorageModule {}
