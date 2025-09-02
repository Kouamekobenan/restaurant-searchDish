import { Dish } from 'src/dish/domain/entities/dish.entity';
import { Restaurant } from 'src/restaurant/domain/entities/restaurant.entity';
export class RestaurantDish {
  constructor(
    private readonly id: string,
    private readonly restaurantId: string,
    private readonly dishId: string,
    private readonly price: number | null,
    private readonly currency: string = 'XOF',
    private readonly description?: string | null,
    private readonly isAvailable: boolean = true,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
    private readonly restaurant?: Restaurant,
    private readonly dish?: Dish,
  ) {}
  gitId(): string {
    return this.id;
  }
  gitRestaurantId(): string {
    return this.restaurantId;
  }
  gitDishId(): string {
    return this.dishId;
  }
  getPrice(): number | null {
    return this.price;
  }
  getRestaurant(): Restaurant | undefined {
    return this.restaurant;
  }

  getDish(): Dish | undefined {
    return this.dish;
  }
}
