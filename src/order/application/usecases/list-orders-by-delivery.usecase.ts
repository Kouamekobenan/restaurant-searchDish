import { Inject, Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
  PaginatedOrders,
} from 'src/order/domain/interfaces/order-repository.interface';

@Injectable()
export class ListOrdersByDeliveryUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
  ) {}

  /**
   * Liste toutes les commandes assignées à un livreur (paginé).
   * Chaque commande inclut les infos du restaurant qui a fourni les plats.
   */
  async execute(
    deliveryUserId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedOrders> {
    return this.orderRepository.paginateByDeliveryUser(
      deliveryUserId,
      page,
      limit,
    );
  }
}
