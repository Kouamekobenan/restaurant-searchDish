import { Order, OrderStatus } from '../entities/order.entity';

export interface CreateOrderItemInput {
  restaurantDishId: string;
  quantity: number;
  unitPriceCents: number;
  currency: string;
}

export interface CreateOrderInput {
  userId: string;
  restaurantId: string;
  reference: string;
  totalAmountCents: number;
  currency: string;
  items: CreateOrderItemInput[];
}

export const OrderRepositoryName = 'IOrderRepository';
export interface IOrderRepository {
  create(input: CreateOrderInput): Promise<Order>;
  getById(id: string): Promise<Order>;
  getByReference(reference: string): Promise<Order | null>;
  paginateByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: Order[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }>;
  updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order>;
  updatePaymentRequest(
    id: string,
    paymentMethod: string,
    jekoPaymentRequestId: string,
  ): Promise<Order>;
}
