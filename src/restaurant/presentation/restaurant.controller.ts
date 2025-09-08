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
  UploadedFile,
  UseInterceptors,
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
  ApiConsumes,
} from '@nestjs/swagger';
import { UpdateRestaurantUseCase } from '../application/usecases/update-restaurant.useCase';
import { UpdateRestaurantDto } from '../application/dtos/update-restaurant.dto';
import { PaginationRestaurantUseCase } from '../application/usecases/pagination-restaurant.usecase';
import { PaginateDto } from '../application/dtos/paginate-restaurant.dto';
import { GetAllRestaurantUseCase } from '../application/usecases/getAll-restaurant.usecase';
import { DeleteRestaurantUseCase } from '../application/usecases/delete-restaurant.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindRestaurantByIdUseCase } from '../application/usecases/find-restaurant-byId.usecase';
import { DeactivateRestaurantUseCase } from '../application/usecases/deactivate-restaurant.usecase';
import { ActivateRestaurantUseCase } from '../application/usecases/activate-restaurant.usecase';

// ✅ Multer config avec validation
const multerOptions = {
  limits: {
    fileSize: 2 * 1024 * 1024, // Max 2 Mo
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\/(jpg|jpeg|png)$/;
    if (!file.mimetype.match(allowedTypes)) {
      return cb(
        new BadRequestException(
          '❌ Seules les images JPG, JPEG, PNG sont autorisées.',
        ),
        false,
      );
    }
    cb(null, true);
  },
};
@ApiTags('Restaurant') // Groupe Swagger
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly createRestaurantUseCase: CreateRestaurantUseCase,
    private readonly updateRestaurantUseCase: UpdateRestaurantUseCase,
    private readonly paginationRestaurantUseCase: PaginationRestaurantUseCase,
    private readonly getAllRestaurantUseCase: GetAllRestaurantUseCase,
    private readonly deleteRestaurantUseCase: DeleteRestaurantUseCase,
    private readonly findRestaurantByIdUseCase: FindRestaurantByIdUseCase,
    private readonly deactivateRestaurantUseCase: DeactivateRestaurantUseCase,
    private readonly activateRestaurantUseCase: ActivateRestaurantUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Créer un nouveau restaurant' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant créé avec succès',
    type: Restaurant,
  })
  @ApiBadRequestResponse({ description: 'Requête invalide' })
  async create(
    @Body() createDto: RestaurantDto,
    @UploadedFile() image: Express.Multer.File, // ← image reçue
  ): Promise<Restaurant> {
    return await this.createRestaurantUseCase.execute(createDto, image);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions))
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
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Restaurant> {
    return await this.updateRestaurantUseCase.execute(id, updateDto, image);
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
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un restaurant par ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Identifiant unique du restaurant',
    example: 'clx12abcde0000wxyz',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant trouvé avec succès',
    type: Restaurant,
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  async findById(@Param('id') id: string): Promise<Restaurant> {
    return await this.findRestaurantByIdUseCase.execute(id);
  }
  @Patch('deactivate/:id')
  @ApiOperation({ summary: 'Désactiver un restaurant' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Identifiant du restaurant à désactiver',
    example: 'clx1234560000abcd1234',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant désactivé avec succès',
    schema: {
      example: { message: 'Restaurant désactivé avec succès' },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  async activate(@Param('id') id: string): Promise<{ message: string }> {
    return await this.deactivateRestaurantUseCase.execute(id);
  }
  @Patch('activate/:id')
  @ApiOperation({ summary: 'activer un restaurant' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Identifiant du restaurant à activer',
    example: 'clx1234560000abcd1234',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant activé avec succès',
    schema: {
      example: { message: 'Restaurant activé avec succès' },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  async deactivate(@Param('id') id: string): Promise<{ message: string }> {
    return await this.activateRestaurantUseCase.execute(id);
  }
}
