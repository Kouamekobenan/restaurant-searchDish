import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDishDto {
  @ApiProperty({
    example: 'Pizza Margherita',
    description: 'Nom du plat',
    required: false, // ← Indiquer que c'est optionnel dans Swagger
  })
  @IsOptional() // ← AJOUT IMPORTANT : Rendre le champ optionnel
  @IsString()
  @IsNotEmpty()
  name?: string; // ← Ajouter '?' pour indiquer que c'est optionnel en TypeScript

  @ApiProperty({
    example: 'Pizza classique avec sauce tomate et mozzarella',
    description: 'Description du plat',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string; // ← Ajouter '?' ici aussi pour la cohérence

  @ApiProperty({
    example: 'Plat principal',
    description: 'Catégorie du plat (ex: Entrée, Dessert, Plat principal)',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image du plat (fichier à uploader)',
    required: false,
  })
  @IsOptional()
  image?: any;
}
