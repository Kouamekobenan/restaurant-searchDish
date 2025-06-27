import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
  @ApiProperty({
    description: 'Identifiant unique du favori',
    example: 'clx123abc456',
  })
  id: string;

  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'Jean Dupont',
    nullable: true,
  })
  nameUser: string | null;

  @ApiProperty({
    description: 'Nom du restaurant favori',
    example: 'Le Gourmet',
  })
  nameRestaurant: string;

  @ApiProperty({
    description: 'Date de création du favori',
    example: '2024-06-26T12:00:00.000Z',
  })
  createdAt: Date;
}
