import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DishRepositoryName,
  IDishRepository,
} from 'src/dish/domain/interfaces/dish-repository.interface';
import {
  FileUploader,
  FileUploaderName,
} from 'src/cloudinary/file-upload.interface';

@Injectable()
export class DeleteDishUseCase {
  private readonly logger = new Logger(DeleteDishUseCase.name);

  constructor(
    @Inject(DishRepositoryName)
    private readonly dishRepository: IDishRepository,
    @Inject(FileUploaderName)
    private readonly fileUploader: FileUploader,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      const dish = await this.dishRepository.getById(id);
      if (!dish) {
        throw new NotFoundException('Dish not found');
      }
      // Supprimer l'image si elle existe
      if (dish.getImage()) {
        // Extraire le public_id depuis l’URL si nécessaire
        const publicId = this.extractPublicId(dish.getImage() ?? "");
        if (publicId) {
          await this.fileUploader.delete(publicId, 'image');
        }
      }
      await this.dishRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error('Échec de la suppression du plat', error.message);
      throw new BadRequestException('Échec de la suppression du plat', {
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
