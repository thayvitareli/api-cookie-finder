import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FindManySharedDto } from 'src/shared/dto/find-many.dto';

export class ListRecipesPaginatedRequest extends FindManySharedDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  categoryCode?: string;

  @IsOptional()
  @IsString()
  nameContains?: string;
}
