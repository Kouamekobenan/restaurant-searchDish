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
import { RestaurantDto } from '../dtos/create-restaurant.dto';
import { Restaurant } from 'src/restaurant/domain/entities/restaurant.entity';
import {
  FileUploader,
  FileUploaderName,
} from 'src/cloudinary/file-upload.interface';
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
      const image = imagePath
        ? await this.fileUploader.upload(imagePath, 'image')
        : undefined;
      const restaurant = await this.restaurantRepository.create({
        ...createDto,
        image: image,
      });
      return restaurant;
    } catch (error) {
      this.logger.error('Failled to create restaurant', error.stack);
      throw new BadRequestException('Failled to create restaurant', {
        cause: error,
        description: error.message,
      });
    }
  }
}
