import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/auth/users/domain/enums/role.enum';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginateDto } from 'src/common/dtos/pagination.dto';
import { CreateDeliveryUserDto } from './dtos/create-delivery-user.dto';
import { CreateDeliveryUserUseCase } from './usecases/create-delivery-user.usecase';
import { ListDeliveryUsersUseCase } from './usecases/list-delivery-users.usecase';
import { DeleteDeliveryUserUseCase } from './usecases/delete-delivery-user.usecase';

@ApiTags('delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly createDeliveryUserUseCase: CreateDeliveryUserUseCase,
    private readonly listDeliveryUsersUseCase: ListDeliveryUsersUseCase,
    private readonly deleteDeliveryUserUseCase: DeleteDeliveryUserUseCase,
  ) {}

  /**
   * POST /delivery/users
   * Créer un compte livreur.
   * Accessible par ADMIN seulement (ou public si tu veux auto-inscription).
   */
  @Post('users')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Créer un compte livreur (Admin)',
    description:
      'Crée un utilisateur avec le rôle DELIVERY. Le mot de passe est hashé automatiquement. ' +
      "L'email et le téléphone doivent être uniques.",
  })
  @ApiResponse({
    status: 201,
    description: 'Livreur créé avec succès',
    schema: {
      example: {
        id: 'cm_xxx',
        name: 'Kofi Mensah',
        email: 'kofi@email.com',
        phone: '+2250701234567',
        role: 'DELIVERY',
        createdAt: '2026-09-13T11:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Email ou téléphone déjà utilisé' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createDeliveryUser(@Body() dto: CreateDeliveryUserDto) {
    return await this.createDeliveryUserUseCase.execute(dto);
  }

  /**
   * GET /delivery/users
   * Lister tous les livreurs disponibles.
   * Public — accessible par les clients pour choisir un livreur lors de la commande.
   */
  @Get('users')
  @Public()
  @ApiOperation({
    summary: 'Lister les livreurs disponibles',
    description:
      'Retourne la liste paginée des livreurs (rôle DELIVERY) avec le nombre total de livraisons effectuées. ' +
      'Un client peut utiliser cet endpoint pour choisir un livreur avant de passer commande.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Liste des livreurs',
    schema: {
      example: {
        data: [
          {
            id: 'cm_xxx',
            name: 'Kofi Mensah',
            phone: '+2250701234567',
            email: 'kofi@email.com',
            role: 'DELIVERY',
            totalDeliveries: 12,
            createdAt: '2026-09-13T11:00:00.000Z',
          },
        ],
        total: 5,
        totalPage: 1,
        page: 1,
        limit: 20,
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async listDeliveryUsers(@Query() query: PaginateDto) {
    return await this.listDeliveryUsersUseCase.execute(query.page, query.limit);
  }

  /**
   * DELETE /delivery/users/:id
   * Supprimer un compte livreur.
   * Accessible par ADMIN seulement.
   */
  @Delete('users/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Supprimer un livreur (Admin)',
    description: 'Supprime un utilisateur livreur (rôle DELIVERY) par son ID.',
  })
  @ApiParam({ name: 'id', description: 'ID du livreur à supprimer' })
  @ApiResponse({ status: 200, description: 'Livreur supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Livreur non trouvé' })
  async deleteDeliveryUser(@Param('id') id: string) {
    return await this.deleteDeliveryUserUseCase.execute(id);
  }
}
