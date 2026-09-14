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
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
  @IsOptional()
  @IsString()
  countryName: string;

  @IsOptional()
  @IsString()
  statusType?: string;
  // Si tu veux utiliser cityName à la place, change countryName par cityName ici
}