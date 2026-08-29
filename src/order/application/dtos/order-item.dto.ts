import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    example: 'ckv7c9m3g0001ks8j2mg91lm5',
    description: 'ID de la liaison RestaurantDish (plat proposé par ce restaurant)',
  })
  @IsString()
  @IsNotEmpty()
  restaurantDishId: string;

  @ApiProperty({ example: 2, description: 'Quantité commandée' })
  @IsInt()
  @IsPositive()
  quantity: number;
}
