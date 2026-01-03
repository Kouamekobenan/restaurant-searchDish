import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateDishDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
  // Tu dois ajouter la propriété que tu envoies depuis le front
  @IsOptional()
  @IsString()
  dishName: string;
  // Si tu veux utiliser cityName à la place, change countryName par cityName ici
}