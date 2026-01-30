import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import type { Express } from 'express';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch {
      // Allow plain text; Prisma JSON field accepts strings too.
      return value;
    }
  })
  @IsNotEmpty()
  //   @IsJSON()
  ingredients: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @IsOptional()
  @IsString()
  video_uri?: string;

  @IsNotEmpty()
  @IsString()
  category_id: string;

  user_id: string;

  @IsOptional()
  file?: Express.Multer.File;
}
