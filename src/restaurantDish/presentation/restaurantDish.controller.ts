import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateRestaurantDishUseCase } from '../application/usecases/create-restaurantDish.usecase';
import { CreateRestaurantDishDto } from '../application/dtos/create-restaurantDishDto';
import { RestaurantDish } from '../domain/entities/restaurantDish.entity';
import { UpdateRestaurantDisuUseCase } from '../application/usecases/update-restaurantdish.usecase';
import { UpdateRestaurantDishDto } from '../application/dtos/update-restaurantDish';
import { GetRestaurantDishUseCase } from '../application/usecases/get-restaurantDish-byID';
import { PaginationDishUseCase } from '../application/usecases/restaurantDish.usecase';
import { PaginateDto } from 'src/common/dtos/pagination.dto';
import { Dish } from 'src/dish/domain/entities/dish.entity';
import { FindAllRestaurantDishUseCase } from '../application/usecases/find-all-restaurantDish.usecase';
import { DeleteRestaurantDishUseCase } from '../application/usecases/delete-restaurantdish.usecase';
import { FilterRestaurantUseCase } from '../application/usecases/filter-restaurant.usecase';
import { SearchDto } from '../application/dtos/search-restaurantdish.dto';

@Controller('restaurantDish')
@ApiTags('restaurantDish')
export class RestaurantDishController {
  constructor(
    private readonly createRestaurantDishUseCase: CreateRestaurantDishUseCase,
    private readonly updateRestaurantDisuUseCase: UpdateRestaurantDisuUseCase,
    private readonly getRestaurantDishUseCase: GetRestaurantDishUseCase,
    private readonly paginationDishUseCase: PaginationDishUseCase,
    private readonly findAllRestaurantDishUseCase: FindAllRestaurantDishUseCase,
    private readonly deleteRestaurantDishUseCase: DeleteRestaurantDishUseCase,
    private readonly filterRestaurantUseCase: FilterRestaurantUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une liaison restaurant-plat' })
  @ApiBody({
    type: CreateRestaurantDishDto,
    examples: {
      example1: {
        summary: 'Exemple de liaison',
        value: {
          restaurantId: 'abc123',
          dishId: 'dish456',
          price: 19.99,
          currency: 'EUR',
          description: 'Plat du jour servi chaud',
          isAvailable: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'RestaurantDish créé avec succès',
    type: RestaurantDish,
  })
  async create(
    @Body() createDto: CreateRestaurantDishDto,
  ): Promise<RestaurantDish> {
    return await this.createRestaurantDishUseCase.execute(createDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Recherche paginée de restaurants par nom' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de la page',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Nombre d’éléments par page',
    example: 10,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Nom ou mot-clé du restaurant à rechercher',
    example: 'Chez Mario',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste filtrée des restaurants',
    type: RestaurantDish,
    isArray: true,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(@Query() query: PaginateDto, @Query() nameDto: SearchDto) {
    return await this.filterRestaurantUseCase.execute(
      query.page,
      query.limit,
      nameDto.name,
    );
  }

  @Get('paginate')
  @ApiOperation({ summary: 'Récupérer une pagination des plats' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de page (par défaut: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre d'éléments par page (par défaut: 10)",
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des plats',
    type: Dish,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide (paramètres manquants ou incorrects)',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async pagination(@Query() query: PaginateDto) {
    return await this.paginationDishUseCase.execute(query.page, query.limit);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une association restaurant-plat' })
  @ApiParam({
    name: 'id',
    description: "ID de l'association RestaurantDish à mettre à jour",
    example: 'abc123-xyz789',
  })
  @ApiBody({
    type: UpdateRestaurantDishDto,
    examples: {
      exemple1: {
        summary: 'Mise à jour du prix et de la disponibilité',
        value: {
          price: 4000,
          currency: 'XOF',
          isAvailable: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Association mise à jour avec succès',
    type: RestaurantDish,
  })
  @ApiResponse({
    status: 404,
    description: 'Association non trouvée',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRestaurantDishDto,
  ): Promise<RestaurantDish> {
    return await this.updateRestaurantDisuUseCase.execute(id, updateDto);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une association restaurant-plat par ID' })
  @ApiParam({
    name: 'id',
    description: "ID de l'association RestaurantDish à récupérer",
    example: 'abc123-xyz789',
  })
  @ApiResponse({
    status: 200,
    description: 'Association trouvée avec succès',
    type: RestaurantDish,
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune association trouvée avec cet ID',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  async getId(@Param('id') id: string): Promise<RestaurantDish> {
    return await this.getRestaurantDishUseCase.execute(id);
  }
  @Get()
  @ApiOperation({ summary: 'Liste tous les plats des restaurants' })
  @ApiResponse({
    status: 200,
    description: 'Liste des plats trouvée avec succès',
    type: RestaurantDish,
    isArray: true,
  })
  async getAll(): Promise<RestaurantDish[]> {
    return await this.findAllRestaurantDishUseCase.execute();
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprime un plat de restaurant par son ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant du plat à supprimer',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Plat supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Plat non trouvé',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteRestaurantDishUseCase.execute(id);
  }
}
