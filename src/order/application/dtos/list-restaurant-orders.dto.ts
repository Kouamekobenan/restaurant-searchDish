import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListRestaurantOrdersDto {
  @ApiPropertyOptional({
    description: 'Filtre de statut (ex: ONGOING, COMPLETED, PENDING_PAYMENT, PAID, CONFIRMED, PREPARING, READY_FOR_DELIVERY, IN_DELIVERY, DELIVERED, CANCELLED)',
  })
  @IsOptional()
  @IsString()
  statusType?: string;

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
