import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FindManySharedDto } from '../../../../shared/dto/find-many.dto';

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

  @IsOptional()
  @IsString()
  orderBy?: 'top_rated' | 'newest';

  @IsOptional()
  @IsString()
  period?: 'weekly' | 'all_time';
}
