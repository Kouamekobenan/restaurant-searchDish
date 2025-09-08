import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  IRestaurantRepository,
  RestaurantRepositoryName,
} from 'src/restaurant/domain/interfaces/restaurant.interface';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { Restaurant } from 'src/restaurant/domain/entities/restaurant.entity';
import {
  FileUploader,
  FileUploaderName,
} from 'src/cloudinary/file-upload.interface';

@Injectable()
export class UpdateRestaurantUseCase {
  private readonly logger = new Logger(UpdateRestaurantUseCase.name);
  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepository: IRestaurantRepository,
    @Inject(FileUploaderName)
    private readonly fileUploader: FileUploader,
  ) {}
  async execute(
    id: string,
    updateDto: UpdateRestaurantDto,
    imagePath?: Express.Multer.File,
  ): Promise<Restaurant> {
    try {
      const existingRestaurant = await this.restaurantRepository.findById(id);
      let imageUrl = existingRestaurant.getId();
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
      const restaurantData = await this.restaurantRepository.update(id, {
        ...updateDto,
        image: imageUrl,
      });
      this.logger.log(
        `This is data update restaurant:${JSON.stringify(restaurantData)}`,
      );
      return restaurantData;
    } catch (error) {
      this.logger.error(`Failled to update restaurant data`, error.stack);
      throw new BadRequestException('Failled to update restaurant', {
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
