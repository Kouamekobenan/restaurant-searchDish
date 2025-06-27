import {
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
import { CreateRestaurantUseCase } from '../application/usecases/create-restaurant.usecase';
import { RestaurantDto } from '../application/dtos/create-restaurant.dto';
import { Restaurant } from '../domain/entities/restaurant.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateRestaurantUseCase } from '../application/usecases/update-restaurant.useCase';
import { UpdateRestaurantDto } from '../application/dtos/update-restaurant.dto';
import { PaginationRestaurantUseCase } from '../application/usecases/pagination-restaurant.usecase';
import { PaginateDto } from '../application/dtos/paginate-restaurant.dto';
import { GetAllRestaurantUseCase } from '../application/usecases/getAll-restaurant.usecase';
import { DeleteRestaurantUseCase } from '../application/usecases/delete-restaurant.usecase';

@ApiTags('Restaurant') // Groupe Swagger
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly createRestaurantUseCase: CreateRestaurantUseCase,
    private readonly updateRestaurantUseCase: UpdateRestaurantUseCase,
    private readonly paginationRestaurantUseCase: PaginationRestaurantUseCase,
    private readonly getAllRestaurantUseCase: GetAllRestaurantUseCase,
    private readonly deleteRestaurantUseCase: DeleteRestaurantUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau restaurant' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant créé avec succès',
    type: Restaurant,
  })
  @ApiBadRequestResponse({ description: 'Requête invalide' })
  async create(@Body() createDto: RestaurantDto): Promise<Restaurant> {
    return await this.createRestaurantUseCase.execute(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un restaurant' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID du restaurant à mettre à jour',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant mis à jour avec succès',
    type: Restaurant,
  })
  @ApiNotFoundResponse({ description: 'Restaurant non trouvé' })
  @ApiBadRequestResponse({ description: 'Requête invalide' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return await this.updateRestaurantUseCase.execute(id, updateDto);
  }
  @Get('paginate')
  @ApiOperation({ summary: 'Lister les restaurants avec pagination' })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Numéro de la page (à partir de 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Nombre d’éléments par page',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des restaurants',
    type: [Restaurant], // ou un objet si tu retournes un objet avec { data, totalPage, ... }
  })
  @ApiBadRequestResponse({ description: 'Paramètres de pagination invalides' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async paginate(@Query() query: PaginateDto) {
    return await this.paginationRestaurantUseCase.execute(
      query.page,
      query.limit,
    );
  }
  @Get()
  @ApiOperation({ summary: 'Récupérer tous les restaurants' })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les restaurants',
    type: [Restaurant], // Assure-toi que l'entité Restaurant est bien décorée avec @ApiProperty dans ses DTOs si nécessaire
  })
  async getAll(): Promise<Restaurant[]> {
    return await this.getAllRestaurantUseCase.execute();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un restaurant par ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: "L'identifiant du restaurant à supprimer",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant supprimé avec succès',
    schema: { example: true },
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant non trouvé',
  })
  async restauDelete(@Param('id') id: string): Promise<boolean> {
    return await this.deleteRestaurantUseCase.execute(id);
  }
}
