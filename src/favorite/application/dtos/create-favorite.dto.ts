import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui ajoute le restaurant en favori",
    example: 'b1c24f4a-3f70-4d5e-a927-4df3cfbe3b94',
  })
  @IsUUID('4', { message: 'userId doit être un UUID valide' })
  @IsNotEmpty({ message: 'userId est requis' })
  userId: string;

  @ApiProperty({
    description: 'ID du restaurant à ajouter aux favoris',
    example: 'f18e82fa-8a84-4d3f-96f4-9d94e2a87461',
  })
  @IsUUID('4', { message: 'restaurantId doit être un UUID valide' })
  @IsNotEmpty({ message: 'restaurantId est requis' })
  restaurantId: string;
}
