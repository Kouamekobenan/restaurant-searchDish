import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RestaurantDto {
  @ApiProperty({ example: 'Le Gourmet' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Restaurant gastronomique français' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '12 Rue des Lilas, Abidjan' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Côte d\'Ivoire', description: 'Pays du restaurant', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'Abidjan', description: 'Ville du restaurant', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '+2250700000000' })
  @IsPhoneNumber('CI')
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://www.legourmet.ci' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;
  @ApiProperty({ example: false, required: false, default: false })
  @Transform(({ value }) => {
    // Si pas défini ou vide, retourner false
    if (value === undefined || value === null || value === '') {
      return false;
    }

    // Gérer les strings (multipart/form-data envoie des strings)
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    // Gérer les booleans
    return value === true;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    example: {
      monday: '08:00-20:00',
      tuesday: '08:00-20:00',
      wednesday: '08:00-20:00',
      thursday: '08:00-20:00',
      friday: '08:00-20:00',
      saturday: '08:00-12:00',
      sunday: '14:00-20:00',
    },
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsOptional()
  openingHours?: Record<string, string>;

  @ApiProperty({
    example: 'ckv7c9m3g0001ks8j2mg91lm5',
    description: 'ID du restaurateur',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
