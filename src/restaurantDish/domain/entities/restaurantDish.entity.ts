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
  ) {}
  gitId():string{
    return this.id
  }
  gitRestaurantId():string{
    return this.restaurantId
  }
  gitDishId():string{
    return this.dishId
  }
  getPrice():number | null{
    return this.price
  }
}