import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListDeliveryUsersUseCase {
  private readonly logger = new Logger(ListDeliveryUsersUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liste tous les livreurs disponibles (rôle DELIVERY).
   * Utilisé par le client pour choisir son livreur lors de la commande.
   * Le mot de passe n'est jamais retourné.
   */
  async execute(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [deliveryUsers, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'DELIVERY' },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          createdAt: true,
          // Stats de livraison : nombre de commandes en cours
          _count: {
            select: { deliveries: true },
          },
        },
      }),
      this.prisma.user.count({ where: { role: 'DELIVERY' } }),
    ]);

    return {
      data: deliveryUsers.map((u) => ({
        id: u.id,
        name: u.name,
        phone: u.phone,
        email: u.email,
        role: u.role,
        totalDeliveries: u._count.deliveries,
        createdAt: u.createdAt,
      })),
      total,
      totalPage: Math.ceil(total / limit),
      page,
      limit,
    };
  }
}
