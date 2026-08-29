import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '+2250701234567',
    description: 'Numéro de téléphone au format international (8-15 chiffres)',
  })
  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le téléphone est obligatoire' })
  phone: string;

  @ApiProperty({
    example: 'password123',
    description: "Le mot de passe de l'utilisateur",
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;
}
