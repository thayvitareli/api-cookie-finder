import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { Express } from 'express';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image_uri?: string;

  @IsOptional()
  file?: Express.Multer.File;
}
