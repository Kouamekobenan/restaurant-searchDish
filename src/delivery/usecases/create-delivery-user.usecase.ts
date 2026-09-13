import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateDeliveryUserDto } from '../dtos/create-delivery-user.dto';

@Injectable()
export class CreateDeliveryUserUseCase {
  private readonly logger = new Logger(CreateDeliveryUserUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un compte livreur avec le rôle DELIVERY.
   * L'email et le téléphone doivent être uniques.
   */
  async execute(dto: CreateDeliveryUserDto) {
    // Vérifier l'unicité de l'email
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new BadRequestException(`L'email ${dto.email} est déjà utilisé`);
    }

    // Vérifier l'unicité du téléphone
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existingPhone) {
      throw new BadRequestException(
        `Le numéro de téléphone ${dto.phone} est déjà utilisé`,
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const deliveryUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          phone: dto.phone,
          role: 'DELIVERY',
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      this.logger.log(`Livreur créé : ${deliveryUser.id}`);
      return deliveryUser;
    } catch (error) {
      this.logger.error('Échec de création du livreur', error.stack);
      throw new BadRequestException('Échec de création du livreur', {
        cause: error,
        description: error.message,
      });
    }
  }
}
