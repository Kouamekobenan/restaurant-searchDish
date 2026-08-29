import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderMapper } from '../domain/mappers/order.mapper';
import { Order, OrderStatus } from '../domain/entities/order.entity';
import {
  CreateOrderInput,
  IOrderRepository,
} from '../domain/interfaces/order-repository.interface';

const ORDER_INCLUDE = { items: true } as const;

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
  ): Promise<{
    data: Order[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> {
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
}
