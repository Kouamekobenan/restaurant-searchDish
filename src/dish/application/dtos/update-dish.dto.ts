import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateDishDto {
  @ApiProperty({
    example: 'Pizza Margherita',
    description: 'Nom du plat',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Pizza classique avec sauce tomate et mozzarella',
    description: 'Description du plat',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'Plat principal',
    description: 'Catégorie du plat (ex: Entrée, Dessert, Plat principal)',
  })
  @IsString()
  @IsOptional()
  category: string;
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image du plat (fichier à uploader)',
    required: false,
  })
  @IsOptional()
  image?: any; 
}
