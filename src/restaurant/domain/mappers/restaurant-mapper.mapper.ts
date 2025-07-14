import { RestaurantDto } from 'src/restaurant/application/dtos/create-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';
import { Prisma, Restaurant as prismaEntity } from '@prisma/client';
import { UpdateRestaurantDto } from 'src/restaurant/application/dtos/update-restaurant.dto';
export class RestaurantMapper {
  toEntiy(modelPrisma: prismaEntity): Restaurant {
    return new Restaurant(
      modelPrisma.id,
      modelPrisma.name,
      modelPrisma.description,
      modelPrisma.address,
      modelPrisma.latitude,
      modelPrisma.longitude,
      modelPrisma.phone,
      modelPrisma.website,
      modelPrisma.openingHours ?? {},
      modelPrisma.image,
      modelPrisma.isActive,
      modelPrisma.createdAt,
      modelPrisma.updatedAt,
    );
  }
  toPersistence(createDto: RestaurantDto): Prisma.RestaurantCreateInput {
    return {
      name: createDto.name,
      description: createDto.description,
      address: createDto.address,
      latitude: Number(createDto.latitude),
      longitude: Number(createDto.longitude),
      phone: createDto.phone,
      website: createDto.website,
      openingHours: createDto.openingHours,
      image: createDto.image,
    };
  }
  update(updateDto: UpdateRestaurantDto): Prisma.RestaurantUpdateInput {
    const dataUpdate: Prisma.RestaurantUpdateInput = {};
    if (updateDto.name !== undefined) {
      dataUpdate.name = updateDto.name;
    }
    if (updateDto.description !== undefined) {
      dataUpdate.description = updateDto.description;
    }
    if (updateDto.address !== undefined) {
      dataUpdate.address = updateDto.address;
    }
    if (updateDto.latitude !== undefined) {
      dataUpdate.latitude = Number(updateDto.latitude);
    }
    if (updateDto.longitude !== undefined) {
      dataUpdate.longitude = Number(updateDto.longitude);
    }
    if (updateDto.phone !== undefined) {
      dataUpdate.phone = updateDto.phone;
    }
    if (updateDto.website !== undefined) {
      dataUpdate.website = updateDto.website;
    }
    if (updateDto.openingHours !== undefined) {
      dataUpdate.openingHours = updateDto.openingHours;
    }
    if (updateDto.image !== undefined) {
      dataUpdate.image = updateDto.image;
    }
    return dataUpdate;
  }
}
