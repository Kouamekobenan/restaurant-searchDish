import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDishDto } from '../dtos/update-dish.dto';
import { Dish } from 'src/dish/domain/entities/dish.entity';
import {
  DishRepositoryName,
  IDishRepository,
} from 'src/dish/domain/interfaces/dish-repository.interface';
import {
  FileUploader,
  FileUploaderName,
} from 'src/cloudinary/file-upload.interface';
@Injectable()
export class UpdateDishUseCase {
  private readonly logger = new Logger(UpdateDishUseCase.name);
  constructor(
    @Inject(DishRepositoryName)
    private readonly dishRepository: IDishRepository,
    @Inject(FileUploaderName)
    private readonly fileUploader: FileUploader,
  ) {}
  async execute(
    id: string,
    updateDto: UpdateDishDto,
    imagePath?: Express.Multer.File,
  ): Promise<Dish> {
    try {
      const existingDish = await this.dishRepository.getById(id);
      if (!existingDish) {
        throw new NotFoundException('Dish is not found');
      }
      let imageUrl = existingDish.getId();
      // Si un nouveau fichier est uploadé, supprimer l'ancien et ajouter le nouveau
      if (imagePath) {
        if (imageUrl) {
          const publicId = this.extractPublicId(imageUrl);
          if (publicId) {
            await this.fileUploader.delete(publicId, 'image');
          }
        }
        imageUrl = await this.fileUploader.upload(imagePath, 'image');
      }
      return await this.dishRepository.update(id, {
        name: updateDto?.name,
        description: updateDto?.description,
        category: updateDto?.category,
        image: imageUrl,
      });
    } catch (error) {
      this.logger.error('Failled to  update dish', error.stack);
      throw new BadRequestException('Failled to update dish', {
        cause: error,
        description: error.message,
      });
    }
  }
  private extractPublicId(url: string): string | null {
    const match = url.match(/\/v\d+\/(.+?)\.[a-z]+$/i);
    return match ? match[1] : null;
  }
}
