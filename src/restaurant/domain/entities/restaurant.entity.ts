export class Restaurant {
  constructor(
    private readonly id: string,
    private name: string,
    private description: string | null,
    private address: string,
    private country: string | null,
    private latitude: number | null,
    private longitude: number | null,
    private phone: string | null,
    private website: string | null,
    private openingHours: {}, // à adapter si tu as une structure spécifique
    private image: string | null,
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
  getCountry(): string | null {
    return this.country;
  }

  getDescription(): string | null {
    return this.description;
  }

  getAddress(): string {
    return this.address;
  }

  getLatitude(): number | null {
    return this.latitude;
  }

  getLongitude(): number | null {
    return this.longitude;
  }

  getPhone(): string | null {
    return this.phone;
  }

  getWebsite(): string | null {
    return this.website;
  }

  getImages(): string | null {
    return this.image;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters
  setName(name: string): void {
    this.name = name;
  }

  setDescription(description: string | null): void {
    this.description = description;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setLatitude(latitude: number | null): void {
    this.latitude = latitude;
  }

  setLongitude(longitude: number | null): void {
    this.longitude = longitude;
  }

  setPhone(phone: string | null): void {
    this.phone = phone;
  }

  setWebsite(website: string | null): void {
    this.website = website;
  }

  setImages(images: string): void {
    this.image = images;
  }

  setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  setUpdatedAt(date: Date): void {
    this.updatedAt = date;
  }
}
