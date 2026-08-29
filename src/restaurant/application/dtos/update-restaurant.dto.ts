import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer'; // Ajout nécessaire
import {
  IsString,
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
  @ApiProperty({
    example: 'Le Gourmet',
    description: 'Nom du restaurant',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Restaurant gastronomique français',
    description: 'Description du restaurant',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '12 Rue des Lilas, Abidjan',
    description: 'Adresse complète du restaurant',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: 5.3456,
    description: 'Latitude du restaurant (coordonnées GPS)',
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : value)) // FormData envoie souvent du texte, on cast en nombre
  @IsNumber()
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    example: -4.0123,
    description: 'Longitude du restaurant (coordonnées GPS)',
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : value)) // Idem pour longitude
  @IsNumber()
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    example: '+2250700000000',
    description: 'Numéro de téléphone du restaurant',
    required: false,
  })
  @IsPhoneNumber('CI')
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'https://www.legourmet.ci',
    description: 'Site web du restaurant',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Image principale du restaurant (upload)',
  })
  @IsOptional()
  image?: any;

  @ApiProperty({
    example: true,
    description: 'Indique si le restaurant est actif ou non',
    required: false,
  })
  @Transform(({ value }) => value === 'true' || value === true) // Transforme "true" (string) en true (boolean)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    example: {
      monday: '08:00-20:00',
    },
    description: "Horaires d'ouverture du restaurant sous forme de JSON",
    type: Object,
    required: false,
  })
  // LA CORRECTION EST ICI :
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  })
  @IsObject()
  @IsOptional()
  openingHours?: Record<string, string>;
}
