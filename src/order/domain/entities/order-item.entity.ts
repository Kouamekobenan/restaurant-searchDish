export class OrderItem {
  constructor(
    private readonly id: string,
    private readonly orderId: string,
    private readonly restaurantDishId: string,
    private readonly quantity: number,
    private readonly unitPriceCents: number,
    private readonly currency: string = 'XOF',
    private readonly dishName: string | null = null,
    private readonly dishImage: string | null = null,
  ) {}

  getId(): string {
    return this.id;
  }
  getRestaurantDishId(): string {
    return this.restaurantDishId;
  }
  getQuantity(): number {
    return this.quantity;
  }
  getUnitPriceCents(): number {
    return this.unitPriceCents;
  }
  getCurrency(): string {
    return this.currency;
  }
  getDishName(): string | null {
    return this.dishName;
  }
  getDishImage(): string | null {
    return this.dishImage;
  }
}
