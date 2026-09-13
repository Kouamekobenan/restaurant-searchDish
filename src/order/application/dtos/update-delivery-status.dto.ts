import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DeliveryStatus } from 'src/order/domain/entities/order.entity';

export class UpdateDeliveryStatusDto {
  @ApiProperty({
    enum: ['IN_DELIVERY', 'DELIVERED'],
    example: 'IN_DELIVERY',
    description: 'Nouveau statut de livraison',
  })
  @IsEnum(['IN_DELIVERY', 'DELIVERED'])
  status: Extract<DeliveryStatus, 'IN_DELIVERY' | 'DELIVERED'>;

  @ApiPropertyOptional({
    example: 'Colis livré à la porte, signé par le client.',
    description: 'Note optionnelle du livreur sur la livraison',
  })
  @IsString()
  @IsOptional()
  note?: string;
}
