import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FindManySharedDto } from 'src/shared/dto/find-many.dto';

export class ListCategoriesPaginatedRequest extends FindManySharedDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  nameContains?: string;
}
