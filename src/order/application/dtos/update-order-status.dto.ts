import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/order/domain/entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: [
      'CONFIRMED',
      'PREPARING',
      'READY_FOR_DELIVERY',
      'CANCELLED',
      'IN_DELIVERY',
      'DELIVERED',
    ],
    example: 'PREPARING',
    description: 'Nouveau statut de la commande',
  })
  @IsEnum([
    'CONFIRMED',
    'PREPARING',
    'READY_FOR_DELIVERY',
    'CANCELLED',
    'IN_DELIVERY',
    'DELIVERED',
  ])
  status: OrderStatus;
}
