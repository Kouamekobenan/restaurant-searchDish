import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class OtpVerifyDto {
  @ApiProperty({
    example: '+2250102030405',
    description: 'Numéro de téléphone de l’utilisateur',
  })
  @IsNotEmpty({ message: 'Le numéro de téléphone est requis' })
  @IsPhoneNumber('CI', {
    message: 'Numéro de téléphone invalide pour la Côte d’Ivoire',
  })
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'Code OTP envoyé par SMS',
  })
  @IsNotEmpty({ message: 'Le code OTP est requis' })
  @Length(4, 6, { message: 'Le code OTP doit contenir entre 4 et 6 chiffres' })
  code: string;
}
