// // src/dispute-categories/interfaces/http/dto/paginate-dispute-category.dto.ts
// import { Type } from 'class-transformer';
// import { IsOptional, IsPositive } from 'class-validator';
// export class PaginateDto {
//   @IsOptional()
//   @IsPositive()
//   @Type(() => Number)
//   page: number = 1;

//   @IsOptional()
//   @IsPositive()
//   @Type(() => Number)
//   limit: number = 10;
// }

import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateDto {
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
  countryName: string;
  // Si tu veux utiliser cityName à la place, change countryName par cityName ici
}