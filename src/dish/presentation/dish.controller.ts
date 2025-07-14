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
import { CreateDishUseCase } from '../application/usecases/create-dish.usecase';
import { DishDto } from '../application/dtos/create-dish.dto';
import { Dish } from '../domain/entities/dish.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { FindallDishUseCase } from '../application/usecases/findAll-dish.usecase';
import { PaginationDishUseCase } from '../application/usecases/pagination-dish.usecase';
import { PaginateDto } from '../application/dtos/pagination-dish.dto';
import { UpdateDishUseCase } from '../application/usecases/update-dish.usecase';
import { UpdateDishDto } from '../application/dtos/update-dish.dto';
import { DeleteDishUseCase } from '../application/usecases/delete-dish.usecase';
import { GetDishByIdUseCase } from '../application/usecases/get-dish-byId.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

// ✅ Multer config avec validation
const multerOptions = {
  storage: diskStorage({
    destination: join(__dirname, '../../../uploads/dish'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
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

@ApiTags('Dish') // Groupe Swagger
@Controller('Dish')
export class DishController {
  constructor(
    private readonly createDishUseCase: CreateDishUseCase,
    private readonly findallDishUseCase: FindallDishUseCase,
    private readonly paginationDishUseCase: PaginationDishUseCase,
    private readonly updateDishUseCase: UpdateDishUseCase,
    private readonly deleteDishUseCase: DeleteDishUseCase,
    private readonly getDishById: GetDishByIdUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: DishDto }) // Swagger doc
  @ApiOperation({ summary: 'Créer un nouveau plat avec image' })
  @ApiResponse({
    status: 201,
    description: 'Le plat a été créé avec succès.',
    type: Dish,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou fichier manquant.',
  })
  async create(
    @Body() createDto: DishDto,
    @UploadedFile() image: Express.Multer.File, 
  ): Promise<Dish> {
    const imagePath: string | undefined = image
      ? `/uploads/dish/${image.filename}`
      : undefined;

    return await this.createDishUseCase.execute(createDto, imagePath);
  }

  @Get('paginate')
  @ApiOperation({ summary: 'Paginer les plats' })
  @ApiQuery({
    name: 'page',
    required: true,
    example: 1,
    description: 'Numéro de page',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    example: 10,
    description: 'Nombre d’éléments par page',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des plats',
    schema: {
      example: {
        data: [
          {
            id: 'abc123',
            name: 'Poulet rôti',
            description: 'Plat délicieux',
            category: 'Plat principal',
            searchTerms: ['poulet', 'rôti'],
          },
        ],
        total: 20,
        totalPage: 2,
        page: 1,
        limit: 10,
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async pagination(@Query() query: PaginateDto) {
    return this.paginationDishUseCase.execute(query.page, query.limit);
  }
  @Get()
  @ApiOperation({ summary: 'Récupérer tous les plats' })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les plats',
    type: Dish,
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async findAll(): Promise<Dish[]> {
    return await this.findallDishUseCase.execute();
  }
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Modifier un plat existant' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Identifiant du plat à modifier',
    example: 'a1b2c3d4',
  })
  @ApiBody({
    type: UpdateDishDto,
    description: 'Données mises à jour du plat',
  })
  @ApiResponse({
    status: 200,
    description: 'Plat mis à jour avec succès',
    type: Dish,
  })
  @ApiResponse({
    status: 404,
    description: 'Plat non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDishDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Dish> {
    const imagePath = image ? `/uploads/dish/${image.filename}` : undefined;
    return await this.updateDishUseCase.execute(id, updateDto, imagePath);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un plat par ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant du plat à supprimer',
    example: 'd4f9c6a1-0b3c-4c12-8c7f-2fa39f305e13',
  })
  @ApiResponse({
    status: 200,
    description: 'Plat supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Plat non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  async delete(@Param('id') id: string) {
    await this.deleteDishUseCase.execute(id);
  }
  @Get(':id')
  @ApiOperation({ summary: 'recuperé un plat par ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant du plat à récupérer',
    example: 'd4f9c6a1-0b3c-4c12-8c7f-2fa39f305e13',
  })
  @ApiResponse({
    status: 200,
    description: 'Plat récupéré avec succès',
    type: Dish, // Assure-toi que la classe `Dish` est bien décorée avec `@ApiProperty`
  })
  @ApiResponse({
    status: 404,
    description: 'Plat non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  getById(@Param('id') id: string): Promise<Dish> {
    return this.getDishById.execute(id);
  }
}
