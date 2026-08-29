import { OrderItem } from './order-item.entity';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PAYMENT_FAILED'
  | 'CANCELLED';

export class Order {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly restaurantId: string,
    private status: OrderStatus,
    private readonly totalAmountCents: number,
    private readonly currency: string,
    private readonly reference: string,
    private paymentMethod: string | null,
    private jekoPaymentRequestId: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private readonly items: OrderItem[] = [],
  ) {}

  getId(): string {
    return this.id;
  }
  getUserId(): string {
    return this.userId;
  }
  getRestaurantId(): string {
    return this.restaurantId;
  }
  getStatus(): OrderStatus {
    return this.status;
  }
  getTotalAmountCents(): number {
    return this.totalAmountCents;
  }
  getCurrency(): string {
    return this.currency;
  }
  getReference(): string {
    return this.reference;
  }
  getPaymentMethod(): string | null {
    return this.paymentMethod;
  }
  getJekoPaymentRequestId(): string | null {
    return this.jekoPaymentRequestId;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }
  getItems(): OrderItem[] {
    return this.items;
  }
}
