import { OrderItem } from './order-item.entity';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PAYMENT_FAILED'
  | 'CANCELLED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_DELIVERY'
  | 'IN_DELIVERY'
  | 'DELIVERED';

export type DeliveryStatus = 'ASSIGNED' | 'IN_DELIVERY' | 'DELIVERED';

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
    private readonly restaurantName: string | null = null,
    private readonly restaurantImage: string | null = null,
    private deliveryUserId: string | null = null,
    private deliveryStatus: DeliveryStatus | null = null,
    private deliveryNote: string | null = null,
    private readonly deliveryUserName: string | null = null,
    private readonly deliveryUserPhone: string | null = null,
    private readonly userName: string | null = null,
    private readonly userPhone: string | null = null,
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
  getRestaurantName(): string | null {
    return this.restaurantName;
  }
  getRestaurantImage(): string | null {
    return this.restaurantImage;
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
  getDeliveryUserId(): string | null {
    return this.deliveryUserId;
  }
  getDeliveryStatus(): DeliveryStatus | null {
    return this.deliveryStatus;
  }
  getDeliveryNote(): string | null {
    return this.deliveryNote;
  }
  getDeliveryUserName(): string | null {
    return this.deliveryUserName;
  }
  getDeliveryUserPhone(): string | null {
    return this.deliveryUserPhone;
  }
  getUserName(): string | null {
    return this.userName;
  }
  getUserPhone(): string | null {
    return this.userPhone;
  }
}
