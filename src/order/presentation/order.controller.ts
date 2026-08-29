import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { PaginateDto } from 'src/common/dtos/pagination.dto';
import { CreateOrderDto } from '../application/dtos/create-order.dto';
import { CreateOrderUseCase } from '../application/usecases/create-order.usecase';
import { GetOrderByIdUseCase } from '../application/usecases/get-order-by-id.usecase';
import { ListOrdersByUserUseCase } from '../application/usecases/list-orders-by-user.usecase';
import { Order } from '../domain/entities/order.entity';

@ApiBearerAuth('access-token')
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly listOrdersByUserUseCase: ListOrdersByUserUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Créer une commande pour un restaurant" })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès (statut PENDING_PAYMENT)' })
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

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Récupérer une commande par ID' })
  @ApiParam({ name: 'id', description: 'ID de la commande' })
  async getById(@Req() req: any, @Param('id') id: string): Promise<Order> {
    return await this.getOrderByIdUseCase.execute(req.user.userId, id);
  }
}
