import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateRestaurantDishDto {
  @ApiProperty({
    example: 'ckv7c9l8n0000ks8j2mjf3n9b',
    description: 'ID du restaurant',
  })
  @IsString()
  restaurantId: string;

  @ApiProperty({
    example: 'ckv7c9m3g0001ks8j2mg91lm5',
    description: 'ID du plat',
  })
  @IsString()
  dishId: string;

  @ApiProperty({
    example: 3500,
    description: 'Prix du plat dans ce restaurant',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 'XOF',
    description: 'Devise utilisée',
    default: 'XOF',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    example: 'Servi avec une sauce arachide spéciale.',
    description: 'Description spécifique au restaurant',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Disponibilité du plat dans ce restaurant',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
