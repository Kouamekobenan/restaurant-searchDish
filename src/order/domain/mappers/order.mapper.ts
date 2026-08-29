import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

export class OrderMapper {
  toEntity(prismaModel: any): Order {
    const items = (prismaModel.items ?? []).map(
      (item: any) =>
        new OrderItem(
          item.id,
          item.orderId,
          item.restaurantDishId,
          item.quantity,
          item.unitPriceCents,
          item.currency,
        ),
    );
    return new Order(
      prismaModel.id,
      prismaModel.userId,
      prismaModel.restaurantId,
      prismaModel.status as OrderStatus,
      prismaModel.totalAmountCents,
      prismaModel.currency,
      prismaModel.reference,
      prismaModel.paymentMethod,
      prismaModel.jekoPaymentRequestId,
      prismaModel.createdAt,
      prismaModel.updatedAt,
      items,
    );
  }
}
