import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { UserRole } from '../../domain/enums/role.enum';
export class UserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: "Adresse email de l'utilisateur",
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'securepassword123',
    description: "Mot de passe de l'utilisateur",
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Jean Dupont',
    description: "Nom de l'utilisateur",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({
    example: '+2250701234567',
    description: 'Numéro de téléphone au format international (8-15 chiffres)',
  })
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/, {
    message:
      'Numéro de téléphone invalide (doit contenir entre 8 et 15 chiffres, optionnellement avec +)',
  })
  phone: string;

  @ApiProperty({
    example: UserRole.RESTAURATEUR,
    enum: UserRole,
    description: "Rôle de l'utilisateur (RESTAURATEUR, ADMIN, DELIVERY)",
    default: UserRole.RESTAURATEUR,
  })
  @IsEnum(UserRole)
  @IsOptional() // facultatif si tu veux que le backend attribue un rôle par défaut
  role?: UserRole;
}
