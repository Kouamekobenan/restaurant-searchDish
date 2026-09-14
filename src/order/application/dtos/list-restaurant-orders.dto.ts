import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class ListRestaurantOrdersDto {
  @ApiPropertyOptional({
    enum: ['ONGOING', 'COMPLETED'],
    description: 'Type de statut des commandes (ONGOING pour les commandes actives, COMPLETED pour les commandes terminées)',
  })
  @IsOptional()
  @IsEnum(['ONGOING', 'COMPLETED'])
  statusType?: 'ONGOING' | 'COMPLETED';

  @ApiPropertyOptional({
    default: 1,
    description: 'Numéro de page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    default: 10,
    description: 'Nombre d’éléments par page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
