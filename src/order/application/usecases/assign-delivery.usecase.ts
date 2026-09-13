import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
} from 'src/order/domain/interfaces/order-repository.interface';
import { Order } from 'src/order/domain/entities/order.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignDeliveryUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Assigne un livreur à une commande.
   * Peut être appelé par le client (lors de la création) ou un admin (après).
   * @param callerId       - ID de l'utilisateur qui fait la requête
   * @param orderId        - ID de la commande à mettre à jour
   * @param deliveryUserId - ID du livreur (doit avoir le rôle DELIVERY)
   * @param isAdmin        - true si l'appelant est ADMIN
   */
  async execute(
    callerId: string,
    orderId: string,
    deliveryUserId: string,
    isAdmin: boolean,
  ): Promise<Order> {
    // Vérifier que la commande existe
    const order = await this.orderRepository.getById(orderId);

    // Vérifier que le client est bien le propriétaire (sauf si admin)
    if (!isAdmin && order.getUserId() !== callerId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas modifier cette commande',
      );
    }

    // Vérifier que l'utilisateur cible est bien un livreur
    const deliveryUser = await this.prisma.user.findUnique({
      where: { id: deliveryUserId },
      select: { id: true, role: true, name: true },
    });

    if (!deliveryUser) {
      throw new NotFoundException(
        `Livreur avec l'ID ${deliveryUserId} introuvable`,
      );
    }

    if (deliveryUser.role !== 'DELIVERY') {
      throw new BadRequestException(
        `L'utilisateur ${deliveryUser.name ?? deliveryUserId} n'est pas un livreur`,
      );
    }

    return this.orderRepository.assignDelivery(orderId, deliveryUserId);
  }
}
