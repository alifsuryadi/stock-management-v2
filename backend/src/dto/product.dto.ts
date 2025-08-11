// backend/src/dto/product.dto.ts
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const parsed = parseInt(value);
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber()
  @Min(0)
  stock?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const parsed = parseInt(value);
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const parsed = parseInt(value);
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber()
  @Min(0)
  stock?: number;
}
