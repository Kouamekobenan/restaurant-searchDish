import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
} from 'src/order/domain/interfaces/order-repository.interface';
import { Order } from 'src/order/domain/entities/order.entity';
import { UpdateDeliveryStatusDto } from '../dtos/update-delivery-status.dto';

@Injectable()
export class UpdateDeliveryStatusUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
  ) {}

  /**
   * Permet au livreur assigné de mettre à jour le statut de livraison.
   * @param deliveryUserId - ID du livreur connecté
   * @param orderId        - ID de la commande
   * @param dto            - Nouveau statut + note optionnelle
   */
  async execute(
    deliveryUserId: string,
    orderId: string,
    dto: UpdateDeliveryStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.getById(orderId);

    // Vérifier que ce livreur est bien assigné à cette commande
    if (order.getDeliveryUserId() !== deliveryUserId) {
      throw new ForbiddenException(
        'Vous n\'êtes pas le livreur assigné à cette commande',
      );
    }

    // Vérifier que la transition de statut est logique
    const currentDeliveryStatus = order.getDeliveryStatus();
    if (dto.status === 'DELIVERED' && currentDeliveryStatus !== 'IN_DELIVERY') {
      throw new BadRequestException(
        'La commande doit être en cours de livraison (IN_DELIVERY) avant d\'être marquée comme livrée',
      );
    }

    return this.orderRepository.updateDeliveryStatus(
      orderId,
      dto.status,
      dto.note,
    );
  }
}
