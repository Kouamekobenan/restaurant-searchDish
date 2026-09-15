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
  getIsAvailable(): boolean {
    return this.isAvailable;
  }
  getRestaurant(): Restaurant | undefined {
    return this.restaurant;
  }

  getDish(): Dish | undefined {
    return this.dish;
  }

  toJSON() {
    return {
      id: this.id,
      restaurantId: this.restaurantId,
      dishId: this.dishId,
      price: this.price,
      currency: this.currency,
      description: this.description,
      isAvailable: this.isAvailable,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      restaurant: this.restaurant && typeof (this.restaurant as any).toJSON === 'function'
        ? (this.restaurant as any).toJSON()
        : this.restaurant ?? null,
      dish: this.dish ?? null,
    };
  }
}
