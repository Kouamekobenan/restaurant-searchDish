import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDishDto {
  @ApiProperty({
    example: 'ckv7c9l8n0000ks8j2mjf3n9b',
    description: 'ID du restaurant',
  })
  restaurantId: string;

  @ApiProperty({
    example: 'ckv7c9m3g0001ks8j2mg91lm5',
    description: 'ID du plat',
  })
  dishId: string;

  @ApiProperty({
    example: 3500,
    description: 'Prix du plat dans ce restaurant',
  })
  price?: number;

  @ApiProperty({
    example: 'XOF',
    description: 'Devise utilisée',
    default: 'XOF',
  })
  currency?: string;

  @ApiProperty({
    example: 'Servi avec une sauce arachide spéciale.',
    description: 'Description spécifique au restaurant',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Disponibilité du plat dans ce restaurant',
    default: true,
  })
  isAvailable?: boolean;
}
