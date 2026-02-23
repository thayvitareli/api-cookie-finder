import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        // Handle standard JSON or strings that look like arrays with single quotes
        const normalized = value.replace(/'/g, '"');
        const parsed = JSON.parse(normalized);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return value.split(',').map((t: string) => t.trim());
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  file?: Express.Multer.File;

  @IsOptional()
  @IsUrl()
  image_uri?: string;
}
