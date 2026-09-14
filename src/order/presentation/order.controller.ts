import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/auth/users/domain/enums/role.enum';
import { PaginateDto } from 'src/common/dtos/pagination.dto';
import { CreateOrderDto } from '../application/dtos/create-order.dto';
import { AssignDeliveryDto } from '../application/dtos/assign-delivery.dto';
import { UpdateDeliveryStatusDto } from '../application/dtos/update-delivery-status.dto';
import { CreateOrderUseCase } from '../application/usecases/create-order.usecase';
import { GetOrderByIdUseCase } from '../application/usecases/get-order-by-id.usecase';
import { ListOrdersByUserUseCase } from '../application/usecases/list-orders-by-user.usecase';
import { AssignDeliveryUseCase } from '../application/usecases/assign-delivery.usecase';
import { UpdateDeliveryStatusUseCase } from '../application/usecases/update-delivery-status.usecase';
import { ListOrdersByDeliveryUseCase } from '../application/usecases/list-orders-by-delivery.usecase';
import { GetRestaurantStatsUseCase } from '../application/usecases/get-restaurant-stats.usecase';
import { ListOrdersByRestaurantUseCase } from '../application/usecases/list-orders-by-restaurant.usecase';
import { UpdateOrderStatusUseCase } from '../application/usecases/update-order-status.usecase';
import { UpdateOrderStatusDto } from '../application/dtos/update-order-status.dto';
import { Order } from '../domain/entities/order.entity';

@ApiBearerAuth('access-token')
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly listOrdersByUserUseCase: ListOrdersByUserUseCase,
    private readonly assignDeliveryUseCase: AssignDeliveryUseCase,
    private readonly updateDeliveryStatusUseCase: UpdateDeliveryStatusUseCase,
    private readonly listOrdersByDeliveryUseCase: ListOrdersByDeliveryUseCase,
    private readonly getRestaurantStatsUseCase: GetRestaurantStatsUseCase,
    private readonly listOrdersByRestaurantUseCase: ListOrdersByRestaurantUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  // ─────────────────────────────────────────────────
  // CLIENT ENDPOINTS
  // ─────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Créer une commande pour un restaurant' })
  @ApiResponse({
    status: 201,
    description: 'Commande créée avec succès (statut PENDING_PAYMENT)',
  })
  async create(@Req() req: any, @Body() dto: CreateOrderDto): Promise<Order> {
    return await this.createOrderUseCase.execute(req.user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Lister mes commandes (paginé)' })
  async list(@Req() req: any, @Query() query: PaginateDto) {
    return await this.listOrdersByUserUseCase.execute(
      req.user.userId,
      query.page,
      query.limit,
    );
  }

  // ─────────────────────────────────────────────────
  // DELIVERY ENDPOINTS
  // ─────────────────────────────────────────────────

  /**
   * GET /orders/my-deliveries
   * Le livreur liste toutes les commandes qui lui sont assignées.
   * Chaque commande contient les infos du restaurant qui a fourni les plats.
   *
   * ⚠️ Cette route est bien déclarée AVANT ":id" pour éviter le conflit de paramètre.
   */
  @Get('my-deliveries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DELIVERY)
  @ApiOperation({
    summary: 'Livreur — Liste mes livraisons assignées (paginé)',
    description:
      'Retourne les commandes assignées au livreur connecté, avec les infos du restaurant qui a fourni les plats.',
  })
  async listMyDeliveries(@Req() req: any, @Query() query: PaginateDto) {
    return await this.listOrdersByDeliveryUseCase.execute(
      req.user.userId,
      query.page,
      query.limit,
    );
  }

  // ─────────────────────────────────────────────────
  // RESTAURATEUR ENDPOINTS
  // ─────────────────────────────────────────────────

  @Get('restaurant/:restaurantId/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURATEUR, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Restaurateur — Obtenir les statistiques du restaurant',
    description:
      'Retourne les statistiques (nombre de commandes et revenus journaliers, hebdomadaires, mensuels).',
  })
  @ApiParam({ name: 'restaurantId', description: 'ID du restaurant' })
  async getRestaurantStats(@Param('restaurantId') restaurantId: string) {
    return await this.getRestaurantStatsUseCase.execute(restaurantId);
  }

  @Get('restaurant/:restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURATEUR, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Restaurateur — Lister les commandes du restaurant (paginé)',
    description:
      'Permet de filtrer les commandes en cours (ONGOING) ou livrées/annulées (COMPLETED).',
  })
  @ApiParam({ name: 'restaurantId', description: 'ID du restaurant' })
  async listRestaurantOrders(
    @Param('restaurantId') restaurantId: string,
    @Query('statusType') statusType?: 'ONGOING' | 'COMPLETED',
    @Query() query?: PaginateDto,
  ) {
    return await this.listOrdersByRestaurantUseCase.execute(
      restaurantId,
      statusType,
      query?.page ?? 1,
      query?.limit ?? 10,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Récupérer une commande par ID' })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  async getById(@Req() req: any, @Param('id') id: string): Promise<Order> {
    return await this.getOrderByIdUseCase.execute(req.user.userId, id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURATEUR, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Restaurateur — Mettre à jour le statut d’une commande',
    description:
      'Changer le statut d’une commande (ex: CONFIRMED, PREPARING, READY_FOR_DELIVERY, CANCELLED).',
  })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return await this.updateOrderStatusUseCase.execute(orderId, dto.status);
  }

  /**
   * PATCH /orders/:id/assign-delivery
   * Assigne un livreur à une commande.
   * Accessible par le client propriétaire ou un admin.
   */
  @Patch(':id/assign-delivery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Assigner un livreur à une commande',
    description:
      'Le client ou un admin peut associer un livreur (rôle DELIVERY) à une commande existante.',
  })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Livreur assigné avec succès' })
  async assignDelivery(
    @Req() req: any,
    @Param('id') orderId: string,
    @Body() dto: AssignDeliveryDto,
  ): Promise<Order> {
    if (!dto.deliveryUserId) {
      throw new BadRequestException('deliveryUserId est requis');
    }
    const isAdmin = req.user.role === UserRole.ADMIN;
    return await this.assignDeliveryUseCase.execute(
      req.user.userId,
      orderId,
      dto.deliveryUserId,
      isAdmin,
    );
  }

  /**
   * PATCH /orders/:id/delivery-status
   * Le livreur met à jour le statut de livraison.
   * Accessible uniquement par le livreur assigné (rôle DELIVERY).
   */
  @Patch(':id/delivery-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DELIVERY)
  @ApiOperation({
    summary: 'Livreur — Mettre à jour le statut de livraison',
    description:
      'Le livreur assigné indique si la commande est en cours de livraison (IN_DELIVERY) ou livrée (DELIVERED). Il peut ajouter une note.',
  })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Statut de livraison mis à jour' })
  async updateDeliveryStatus(
    @Req() req: any,
    @Param('id') orderId: string,
    @Body() dto: UpdateDeliveryStatusDto,
  ): Promise<Order> {
    return await this.updateDeliveryStatusUseCase.execute(
      req.user.userId,
      orderId,
      dto,
    );
  }
}
