import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeleteDeliveryUserUseCase {
  private readonly logger = new Logger(DeleteDeliveryUserUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Livreur avec l'ID ${id} non trouvé`);
    }

    if (user.role !== 'DELIVERY') {
      throw new BadRequestException(
        `L'utilisateur ${id} n'est pas un livreur`,
      );
    }

    try {
      await this.prisma.user.delete({
        where: { id },
      });
      this.logger.log(`Livreur supprimé : ${id}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Échec de suppression du livreur ${id}`, error.stack);
      throw new BadRequestException('Échec de la suppression du livreur', {
        cause: error,
        description: error.message,
      });
    }
  }
}
