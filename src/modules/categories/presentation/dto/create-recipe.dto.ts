import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import type { Express } from 'express';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  //   @Transform(({value}) => typeof value =='string' ? JSON.parse(value): value)
  @IsNotEmpty()
  //   @IsJSON()
  ingredients: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @IsOptional()
  @IsString()
  image_uri?: string;

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
