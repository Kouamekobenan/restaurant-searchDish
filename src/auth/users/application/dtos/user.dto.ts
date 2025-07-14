import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
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
    example: UserRole.RESTAURATEUR,
    enum: UserRole,
    description: "Rôle de l'utilisateur (RESTAURATEUR, ADMIN, DELIVERY)",
    default: UserRole.RESTAURATEUR,
  })
  @IsEnum(UserRole)
  @IsOptional() // facultatif si tu veux que le backend attribue un rôle par défaut
  role?: UserRole;
}
