import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './auth/users/user.module';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { DishModule } from './dish/dish.module';
import { RestaurantDishModule } from './restaurantDish/restaurantDish.module';
import { FavoriteModule } from './favorite/favorite.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    RestaurantModule,
    DishModule,
    RestaurantDishModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
