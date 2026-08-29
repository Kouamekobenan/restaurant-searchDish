import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { JekoPaymentMethod } from 'src/payment/domain/interfaces/payment-gateway.interface';

const PAYMENT_METHODS: JekoPaymentMethod[] = [
  'orange',
  'wave',
  'mtn',
  'moov',
  'djamo',
];

export class InitiatePaymentDto {
  @ApiProperty({
    example: 'wave',
    enum: PAYMENT_METHODS,
    description: 'Moyen de paiement mobile money choisi par le client',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(PAYMENT_METHODS)
  paymentMethod: JekoPaymentMethod;
}
