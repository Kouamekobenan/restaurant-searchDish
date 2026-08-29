import { randomUUID } from 'crypto';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
  CreateOrderItemInput,
} from 'src/order/domain/interfaces/order-repository.interface';
import {
  IRestaurantDishRepository,
  RestaurantDishRepositoryName,
} from 'src/restaurantDish/domain/interfaces/dishRestaurant-repository.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { Order } from 'src/order/domain/entities/order.entity';

@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
    @Inject(RestaurantDishRepositoryName)
    private readonly restaurantDishRepository: IRestaurantDishRepository,
  ) {}

  async execute(userId: string, dto: CreateOrderDto): Promise<Order> {
    const requestedIds = dto.items.map((item) => item.restaurantDishId);
    const uniqueIds = [...new Set(requestedIds)];

    const dishes = await this.restaurantDishRepository.findManyByIds(uniqueIds);
    if (dishes.length !== uniqueIds.length) {
      throw new BadRequestException('Un ou plusieurs plats sont introuvables');
    }

    const dishById = new Map(dishes.map((dish) => [dish.gitId(), dish]));

    let totalAmountCents = 0;
    const items: CreateOrderItemInput[] = dto.items.map((line) => {
      const dish = dishById.get(line.restaurantDishId)!;
      if (dish.gitRestaurantId() !== dto.restaurantId) {
        throw new BadRequestException(
          'Tous les plats commandés doivent appartenir au même restaurant',
        );
      }
      if (!dish.getIsAvailable()) {
        throw new BadRequestException(
          `Le plat ${line.restaurantDishId} n'est plus disponible`,
        );
      }
      const price = dish.getPrice();
      if (price === null || price === undefined) {
        throw new BadRequestException(
          `Le plat ${line.restaurantDishId} n'a pas de prix défini`,
        );
      }
      const unitPriceCents = Math.round(price * 100);
      totalAmountCents += unitPriceCents * line.quantity;

      return {
        restaurantDishId: line.restaurantDishId,
        quantity: line.quantity,
        unitPriceCents,
        currency: 'XOF',
      };
    });
    if (totalAmountCents < 100) {
      throw new BadRequestException(
        'Le montant total de la commande doit être au moins de 100 XOF',
      );
    }

    try {
      return await this.orderRepository.create({
        userId,
        restaurantId: dto.restaurantId,
        reference: `ORD-${randomUUID()}`,
        totalAmountCents,
        currency: 'XOF',
        items,
      });
    } catch (error) {
      this.logger.error('Failed to create order', error.stack);
      throw error;
    }
  }
}
