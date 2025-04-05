import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindManySharedDto {
  @IsOptional()
  @Transform(({ value }) => (value ? +value : 0))
  @IsNumber()
  skip?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? +value : 10))
  @IsNumber()
  take?: number;

  @IsOptional()
  @IsString()
  search?: string;

  userId?: string;
}