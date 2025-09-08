import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  DishRepositoryName,
  IDishRepository,
} from 'src/dish/domain/interfaces/dish-repository.interface';
import { DishDto } from '../dtos/create-dish.dto';
import { Dish } from 'src/dish/domain/entities/dish.entity';
import {
  FileUploader,
  FileUploaderName,
} from 'src/cloudinary/file-upload.interface';
@Injectable()
export class CreateDishUseCase {
  private readonly logger = new Logger(CreateDishUseCase.name);
  constructor(
    @Inject(DishRepositoryName)
    private readonly dishRepositorty: IDishRepository,
    @Inject(FileUploaderName)
    private readonly fileUploader: FileUploader,
  ) {}
  async execute(
    createDto: DishDto,
    pathImage?: Express.Multer.File,
  ): Promise<Dish> {
    try {
      const existingDish = await this.dishRepositorty.findByName(
        createDto.name,
      );
      if (existingDish) {
        throw new BadRequestException('Dish with this name already exists');
      }
      const image = pathImage
        ? await this.fileUploader.upload(pathImage, 'image')
        : undefined;
      const dishs = await this.dishRepositorty.create({
        name: createDto.name,
        description: createDto.description,
        category: createDto.category,
        image: image,
      });
      return dishs;
    } catch (error) {
      this.logger.error('Failled to create dish', error.stack);
      throw new BadRequestException('Failed to create dish', {
        cause: error,
        description: error.message,
      });
    }
  }
}
