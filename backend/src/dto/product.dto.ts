// backend/src/dto/product.dto.ts
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }): number => {
    if (typeof value === 'number') return value;
    const parsed = parseInt(value);
    if (isNaN(parsed)) {
      throw new Error('Invalid categoryId format');
    }
    return parsed;
  })
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @Transform(({ value }): number | undefined => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'number') return value;
    const parsed = parseInt(value);
    if (isNaN(parsed)) {
      throw new Error('Invalid stock format');
    }
    return parsed;
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
  @Transform(({ value }): number | undefined => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'number') return value;
    const parsed = parseInt(value);
    if (isNaN(parsed)) {
      throw new Error('Invalid categoryId format');
    }
    return parsed;
  })
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @Transform(({ value }): number | undefined => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'number') return value;
    const parsed = parseInt(value);
    if (isNaN(parsed)) {
      throw new Error('Invalid stock format');
    }
    return parsed;
  })
  @IsNumber()
  @Min(0)
  stock?: number;
}
