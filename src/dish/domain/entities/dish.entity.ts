export class Dish {
  constructor(
    private readonly id: string,
    private name: string,
    private description: string | null,
    private category: string | null,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}
  // SETTERS
  getId(): string {
    return this.id;
  }
  getDescription(): string | null{
    return this.description;
  }
  getCategory(): string | null {
    return this.category;
  }
  getName(): string {
    return this.name;
  }
}
