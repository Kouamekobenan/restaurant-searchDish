import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: '+2250701234567',
    description: 'Numéro de téléphone au format international (8-15 chiffres)',
  })
  phone: string;

  @ApiProperty({
    example: 'password123',
    description: "Le mot de passe de l'utilisateur",
  })
  password: string;
}
