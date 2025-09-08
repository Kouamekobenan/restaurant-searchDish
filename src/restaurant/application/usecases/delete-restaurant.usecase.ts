import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  FileUploader,
  FileUploaderName,
} from 'src/cloudinary/file-upload.interface';
import {
  IRestaurantRepository,
  RestaurantRepositoryName,
} from 'src/restaurant/domain/interfaces/restaurant.interface';
@Injectable()
export class DeleteRestaurantUseCase {
  private readonly logger = new Logger(DeleteRestaurantUseCase.name);
  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepository: IRestaurantRepository,
    @Inject(FileUploaderName)
    private readonly fileUploader: FileUploader,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      const restaurant = await this.restaurantRepository.findById(id);
      if (!restaurant) {
        throw new NotFoundException(`Restaurant not found ${id}`);
      }
      if (restaurant.getImages()) {
        // Extraire le public_id depuis l’URL si nécessaire
        const publicId = this.extractPublicId(restaurant.getImages() ?? '');
        if (publicId) {
          await this.fileUploader.delete(publicId, 'image');
        }
      }
      await this.restaurantRepository.restauDelete(id);
      return true;
    } catch (error) {
      this.logger.error('Failed to delete restaurant', error.stack);
      throw new BadRequestException('Failed to delete restaurant', {
        cause: error,
        description: error.message,
      });
    }
  }
  private extractPublicId(image: string): string | null {
    try {
      const parts = image.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0]; // sans extension
      return publicId ? `folder_name/${publicId}` : null; // optionnel : ajouter le dossier
    } catch {
      return null;
    }
  }
}
