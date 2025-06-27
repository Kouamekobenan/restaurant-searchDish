import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateFavoriteUseCase } from '../application/usecases/create-favorite.usecase';
import { CreateFavoriteDto } from '../application/dtos/create-favorite.dto';
import { Favorite } from '../domain/entities/favorite-entity';
import { DeleteFavoriteUseCase } from '../application/usecases/delete-favorite.usecase';
import { GetAllFavoriteUserUseCase } from '../application/usecases/getAllFavoriteUser.usecase';
import { FavoriteDto } from '../application/dtos/favorite-user.dto';

@ApiTags('favorite') // Regroupe dans la section "favorite" de Swagger
@Controller('favorite')
export class FavoriteController {
  constructor(
    private readonly createFavoriteUseCase: CreateFavoriteUseCase,
    private readonly deleteFavoriteUseCase: DeleteFavoriteUseCase,
    private readonly getAllFavoriteUserUseCase: GetAllFavoriteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Ajouter un restaurant aux favoris d’un utilisateur',
  })
  @ApiResponse({
    status: 201,
    description: 'Le favori a été ajouté avec succès',
    type: Favorite,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou erreur de validation',
  })
  async create(@Body() createDto: CreateFavoriteDto): Promise<Favorite> {
    return await this.createFavoriteUseCase.execute(createDto);
  }

  @Get('/user/:id')
  @ApiOperation({ summary: "Récupérer les favoris d'un utilisateur" })
  @ApiParam({
    name: 'id',
    description: "ID de l'utilisateur",
    example: 'clx123abc456',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des favoris de l’utilisateur',
    type: FavoriteDto,
    isArray: true,
  })
  async favoriteUser(@Param('id') userId: string): Promise<FavoriteDto[]> {
    return await this.getAllFavoriteUserUseCase.execute(userId);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un favori par ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant du favori à supprimer',
    example: 'clz9e5td10001ujwsa7xp6vlz',
  })
  @ApiResponse({
    status: 200,
    description: 'Favori supprimé avec succès',
    type: Boolean,
  })
  @ApiResponse({
    status: 404,
    description: 'Favori non trouvé',
  })
  async delete(@Param('id') id: string): Promise<boolean> {
    await this.deleteFavoriteUseCase.execute(id);
    return true;
  }
}
