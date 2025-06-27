import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class SearchDto {
  @ApiProperty({
    description: 'Nom ou mot-clé à rechercher',
    example: 'Pizza Margherita',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;
}
