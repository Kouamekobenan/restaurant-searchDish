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
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OtpModule } from './otp/otp.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { DeliveryModule } from './delivery/delivery.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    RestaurantModule,
    DishModule,
    RestaurantDishModule,
    FavoriteModule,
    CloudinaryModule,
    OtpModule,
    OrderModule,
    PaymentModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
