import { Order, OrderStatus, DeliveryStatus } from '../entities/order.entity';
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
          item.restaurantDish?.dish?.name ?? null,
          item.restaurantDish?.dish?.image ?? null,
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
      prismaModel.restaurant?.name ?? null,
      prismaModel.restaurant?.image ?? null,
      prismaModel.deliveryUserId ?? null,
      (prismaModel.deliveryStatus as DeliveryStatus) ?? null,
      prismaModel.deliveryNote ?? null,
      prismaModel.deliveryUser?.name ?? null,
      prismaModel.deliveryUser?.phone ?? null,
      prismaModel.user?.name ?? null,
      prismaModel.user?.phone ?? null,
    );
  }
}
