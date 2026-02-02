import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import type { Express } from 'express';

class IngredientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

class InstructionStepDto {
  @IsInt()
  @Min(1)
  step: number;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsNumber()
  durationMin?: number;
}

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        return [];
      }
    }
    if (Array.isArray(value)) {
      return value.map((item) => plainToInstance(IngredientDto, item));
    }
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        return [];
      }
    }
    if (Array.isArray(value)) {
      return value.map((item) => plainToInstance(InstructionStepDto, item));
    }
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionStepDto)
  instructions: InstructionStepDto[];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  servings: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  prep_time_min: number;

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
