export class Otp {
  constructor(
    private readonly id: string,
    private phone: string,
    private code: string,
    private expiresAt: Date,
    private isUsed: boolean,
    private createdAt: Date,
  ) {}
  get Id(): string {
    return this.id;
  }
  get Phone(): string {
    return this.phone;
  }
  get Code(): string {
    return this.code;
  }
  get ExpiresAt(): Date {
    return this.expiresAt;
  }
  get IsUsed(): boolean {
    return this.isUsed;
  }
  get CreatedAt(): Date {
    return this.createdAt;
  }
}
