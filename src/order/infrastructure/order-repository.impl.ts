import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderMapper } from '../domain/mappers/order.mapper';
import { Order, OrderStatus, DeliveryStatus } from '../domain/entities/order.entity';
import {
  CreateOrderInput,
  IOrderRepository,
  PaginatedOrders,
} from '../domain/interfaces/order-repository.interface';

const ORDER_INCLUDE = {
  restaurant: { select: { id: true, name: true, image: true } },
  user: { select: { id: true, name: true, phone: true } },
  items: {
    include: {
      restaurantDish: {
        include: { dish: { select: { id: true, name: true, image: true } } },
      },
    },
  },
  deliveryUser: { select: { id: true, name: true, phone: true } },
} as const;

@Injectable()
export class OrderRepository implements IOrderRepository {
  private readonly logger = new Logger(OrderRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: OrderMapper,
  ) {}

  async create(input: CreateOrderInput): Promise<Order> {
    try {
      const order = await this.prisma.order.create({
        data: {
          reference: input.reference,
          totalAmountCents: input.totalAmountCents,
          currency: input.currency,
          user: { connect: { id: input.userId } },
          restaurant: { connect: { id: input.restaurantId } },
          items: {
            create: input.items.map((item) => ({
              restaurantDish: { connect: { id: item.restaurantDishId } },
              quantity: item.quantity,
              unitPriceCents: item.unitPriceCents,
              currency: item.currency,
            })),
          },
          ...(input.deliveryUserId
            ? {
                deliveryUser: { connect: { id: input.deliveryUserId } },
                deliveryStatus: 'ASSIGNED',
              }
            : {}),
        },
        include: ORDER_INCLUDE,
      });
      return this.mapper.toEntity(order);
    } catch (error) {
      this.logger.error('Failed to create order', error.stack);
      throw new BadRequestException('Failed to create order', {
        cause: error,
        description: error.message,
      });
    }
  }

  async getById(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.mapper.toEntity(order);
  }

  async getByReference(reference: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { reference },
      include: ORDER_INCLUDE,
    });
    return order ? this.mapper.toEntity(order) : null;
  }

  async paginateByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedOrders> {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: ORDER_INCLUDE,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);
    return {
      data: orders.map((order) => this.mapper.toEntity(order)),
      total,
      totalPage: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const order = await this.prisma.order.update({
        where: { id },
        data: { status },
        include: ORDER_INCLUDE,
      });
      return this.mapper.toEntity(order);
    } catch (error) {
      this.logger.error('Failed to update order status', error.stack);
      throw new BadRequestException('Failed to update order status', {
        cause: error,
        description: error.message,
      });
    }
  }

  async updatePaymentRequest(
    id: string,
    paymentMethod: string,
    jekoPaymentRequestId: string,
  ): Promise<Order> {
    try {
      const order = await this.prisma.order.update({
        where: { id },
        data: { paymentMethod, jekoPaymentRequestId },
        include: ORDER_INCLUDE,
      });
      return this.mapper.toEntity(order);
    } catch (error) {
      this.logger.error('Failed to update order payment request', error.stack);
      throw new BadRequestException('Failed to update order payment request', {
        cause: error,
        description: error.message,
      });
    }
  }

  /** Assigne un livreur à une commande existante */
  async assignDelivery(orderId: string, deliveryUserId: string): Promise<Order> {
    try {
      const order = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          deliveryUser: { connect: { id: deliveryUserId } },
          deliveryStatus: 'ASSIGNED',
        },
        include: ORDER_INCLUDE,
      });
      return this.mapper.toEntity(order);
    } catch (error) {
      this.logger.error('Failed to assign delivery user', error.stack);
      throw new BadRequestException('Failed to assign delivery user', {
        cause: error,
        description: error.message,
      });
    }
  }

  /** Met à jour le statut de livraison (appelé par le livreur) */
  async updateDeliveryStatus(
    orderId: string,
    status: DeliveryStatus,
    note?: string,
  ): Promise<Order> {
    try {
      const order = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          deliveryStatus: status,
          ...(note !== undefined ? { deliveryNote: note } : {}),
          status: status === 'DELIVERED' ? 'DELIVERED' : 'IN_DELIVERY',
        },
        include: ORDER_INCLUDE,
      });
      return this.mapper.toEntity(order);
    } catch (error) {
      this.logger.error('Failed to update delivery status', error.stack);
      throw new BadRequestException('Failed to update delivery status', {
        cause: error,
        description: error.message,
      });
    }
  }
  /** Liste les commandes assignées à un livreur (paginé) */
  async paginateByDeliveryUser(
    deliveryUserId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedOrders> {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { deliveryUserId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: ORDER_INCLUDE,
      }),
      this.prisma.order.count({ where: { deliveryUserId } }),
    ]);
    return {
      data: orders.map((order) => this.mapper.toEntity(order)),
      total,
      totalPage: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  /** Liste les commandes d'un restaurant (paginé avec filtre ONGOING/COMPLETED) */
  async paginateByRestaurant(
    restaurantId: string,
    statusType?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedOrders> {
    const skip = (page - 1) * limit;
    const whereClause: any = { restaurantId };
    if (statusType === 'ONGOING') {
      whereClause.status = {
        in: ['PAID', 'CONFIRMED', 'PREPARING', 'READY_FOR_DELIVERY', 'IN_DELIVERY'],
      };
    } else if (statusType === 'COMPLETED') {
      whereClause.status = { in: ['DELIVERED', 'CANCELLED'] };
    } else if (statusType === 'PENDING') {
      whereClause.status = 'PENDING_PAYMENT';
    } else if (statusType) {
      const validStatuses = [
        'PENDING_PAYMENT',
        'PAID',
        'PAYMENT_FAILED',
        'CANCELLED',
        'CONFIRMED',
        'PREPARING',
        'READY_FOR_DELIVERY',
        'IN_DELIVERY',
        'DELIVERED',
      ];
      if (validStatuses.includes(statusType)) {
        whereClause.status = statusType;
      }
    }
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: ORDER_INCLUDE,
      }),
      this.prisma.order.count({ where: whereClause }),
    ]);

    return {
      data: orders.map((order) => this.mapper.toEntity(order)),
      total,
      totalPage: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  /** Récupère les statistiques d'un restaurant (journalières, hebdomadaires, mensuelles) */
  async getRestaurantStats(restaurantId: string) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const validOrders = await this.prisma.order.findMany({
      where: {
        restaurantId,
        status: { in: ['DELIVERED', 'IN_DELIVERY', 'READY_FOR_DELIVERY', 'PREPARING', 'CONFIRMED', 'PAID'] },
      },
      select: {
        totalAmountCents: true,
        createdAt: true,
        status: true,
      },
    });

    let dailyCount = 0;
    let dailyRevenue = 0;
    let weeklyCount = 0;
    let weeklyRevenue = 0;
    let monthlyCount = 0;
    let monthlyRevenue = 0;
    let ongoingCount = 0;
    let deliveredCount = 0;

    for (const order of validOrders) {
      const orderDate = new Date(order.createdAt);
      
      if (orderDate >= startOfToday) {
        dailyCount++;
        dailyRevenue += order.totalAmountCents;
      }
      if (orderDate >= startOfWeek) {
        weeklyCount++;
        weeklyRevenue += order.totalAmountCents;
      }
      if (orderDate >= startOfMonth) {
        monthlyCount++;
        monthlyRevenue += order.totalAmountCents;
      }

      if (['CONFIRMED', 'PREPARING', 'READY_FOR_DELIVERY', 'IN_DELIVERY', 'PAID'].includes(order.status)) {
        ongoingCount++;
      } else if (order.status === 'DELIVERED') {
        deliveredCount++;
      }
    }

    return {
      daily: { count: dailyCount, revenueCents: dailyRevenue },
      weekly: { count: weeklyCount, revenueCents: weeklyRevenue },
      monthly: { count: monthlyCount, revenueCents: monthlyRevenue },
      ongoingCount,
      deliveredCount,
    };
  }
}
