import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindByDishNameDto {
  @ApiProperty({ required: false, example: 1, description: 'Numéro de la page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: false, example: 10, description: "Nombre d'éléments par page" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @ApiProperty({
    required: false,
    example: 'Pizza',
    description: 'Nom (ou partie du nom) du plat recherché',
  })
  @IsOptional()
  @IsString()
  dishName: string;
}
