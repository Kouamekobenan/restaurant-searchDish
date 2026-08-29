export class OrderItem {
  constructor(
    private readonly id: string,
    private readonly orderId: string,
    private readonly restaurantDishId: string,
    private readonly quantity: number,
    private readonly unitPriceCents: number,
    private readonly currency: string = 'XOF',
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
}
