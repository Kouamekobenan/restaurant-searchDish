import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RestaurantDto } from '../dtos/create-restaurant.dto';
import { Restaurant } from 'src/restaurant/domain/entities/restaurant.entity';
import {
  FileUploader,
  FileUploaderName,
} from 'src/cloudinary/file-upload.interface';
import {
  IRestaurantRepository,
  RestaurantRepositoryName,
} from 'src/restaurant/domain/interfaces/restaurant.interface';
@Injectable()
export class CreateRestaurantUseCase {
  private readonly logger = new Logger(CreateRestaurantUseCase.name);
  constructor(
    @Inject(RestaurantRepositoryName)
    private readonly restaurantRepository: IRestaurantRepository,
    @Inject(FileUploaderName)
    private readonly fileUploader: FileUploader,
  ) {}

  async execute(
    createDto: RestaurantDto,
    imagePath?: Express.Multer.File,
  ): Promise<Restaurant> {
    try {
      // if (typeof createDto.isActive === 'string') {
      //   createDto.isActive = createDto.isActive === 'false';
      // }
      if (typeof createDto.openingHours === 'string') {
        try {
          createDto.openingHours = JSON.parse(createDto.openingHours);
        } catch {
          throw new BadRequestException('Invalid format for openingHours');
        }
      }

      // 🧩 Upload de l’image si présente
      const image = imagePath
        ? await this.fileUploader.upload(imagePath, 'image')
        : undefined;

      // 🧩 Création du restaurant
      const restaurant = await this.restaurantRepository.create({
        ...createDto,
        image,
      });

      return restaurant;
    } catch (error) {
      this.logger.error('Failed to create restaurant', error.stack);
      throw new BadRequestException({
        message: 'Failed to create restaurant',
        cause: error.message,
      });
    }
  }
}
