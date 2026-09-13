import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateDeliveryUserDto {
  @ApiProperty({
    example: 'kofi.mensah@email.com',
    description: 'Email du livreur',
  })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Mot de passe (minimum 6 caractères)',
  })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @ApiProperty({
    example: 'Kofi Mensah',
    description: 'Nom complet du livreur',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '+2250701234567',
    description: 'Numéro de téléphone du livreur (format international)',
  })
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/, {
    message: 'Numéro de téléphone invalide (8-15 chiffres, optionnellement avec +)',
  })
  phone: string;
}
