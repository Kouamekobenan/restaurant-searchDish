import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsLatitude,
  IsLongitude,
  IsPhoneNumber,
  IsUrl,
  IsBoolean,
  IsObject,
} from 'class-validator';

export class UpdateRestaurantDto {
  @ApiProperty({ example: 'Le Gourmet', description: 'Nom du restaurant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Restaurant gastronomique français',
    description: 'Description du restaurant',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '12 Rue des Lilas, Abidjan',
    description: 'Adresse complète du restaurant',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 5.3456,
    description: 'Latitude du restaurant (coordonnées GPS)',
  })
  @IsNumber()
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    example: -4.0123,
    description: 'Longitude du restaurant (coordonnées GPS)',
  })
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    example: '+2250700000000',
    description: 'Numéro de téléphone du restaurant',
  })
  @IsPhoneNumber('CI') // tu peux mettre 'FR' ou 'CI' selon le pays
  phone: string;

  @ApiProperty({
    example: 'https://www.legourmet.ci',
    description: 'Site web du restaurant',
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({
    example:['https://images.com/resto.jpg'] ,
    description: "URL de l'image du restaurant",
  })
  @IsUrl()
  @IsOptional()
  image?: string[];

  @ApiProperty({
    example: true,
    description: 'Indique si le restaurant est actif ou non',
  })
  @IsBoolean()
  isActive: boolean;

   @ApiProperty({
      example: {
        monday: '08:00-20:00',
        tuesday: '08:00-20:00',
        wednesday: '08:00-20:00',
        thursday: '08:00-20:00',
        friday: '08:00-22:00',
        saturday: '10:00-22:00',
        sunday: 'Fermé',
      },
      description: "Horaires d'ouverture du restaurant sous forme de JSON",
      type: Object,
    })
    @IsObject()
    openingHours: Record<string, string>;
}
