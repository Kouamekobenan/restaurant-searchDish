import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AssignDeliveryDto {
  @ApiPropertyOptional({
    example: 'ckv7c9l8n0000ks8j2mjf3n9b',
    description: 'ID de l\'utilisateur livreur (rôle DELIVERY) à assigner à la commande',
  })
  @IsString()
  @IsOptional()
  deliveryUserId?: string;
}
