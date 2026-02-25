import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;
}
