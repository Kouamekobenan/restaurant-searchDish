import { Order, OrderStatus, DeliveryStatus } from '../entities/order.entity';

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
  deliveryUserId?: string;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  totalPage: number;
  page: number;
  limit: number;
}

export interface PeriodStat {
  count: number;
  revenueCents: number;
}

export interface RestaurantStats {
  daily: PeriodStat;
  weekly: PeriodStat;
  monthly: PeriodStat;
  ongoingCount: number;
  deliveredCount: number;
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
  ): Promise<PaginatedOrders>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  updatePaymentRequest(
    id: string,
    paymentMethod: string,
    jekoPaymentRequestId: string,
  ): Promise<Order>;
  /** Assigne un livreur à une commande */
  assignDelivery(orderId: string, deliveryUserId: string): Promise<Order>;
  /** Met à jour le statut de livraison (par le livreur) */
  updateDeliveryStatus(
    orderId: string,
    status: DeliveryStatus,
    note?: string,
  ): Promise<Order>;
  /** Liste les commandes assignées à un livreur (paginé) */
  paginateByDeliveryUser(
    deliveryUserId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedOrders>;
  /** Liste les commandes d'un restaurant (paginé avec filtre ONGOING/COMPLETED) */
  paginateByRestaurant(
    restaurantId: string,
    statusType?: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedOrders>;
  /** Récupère les statistiques d'un restaurant (journalières, hebdomadaires, mensuelles) */
  getRestaurantStats(restaurantId: string): Promise<RestaurantStats>;
}
