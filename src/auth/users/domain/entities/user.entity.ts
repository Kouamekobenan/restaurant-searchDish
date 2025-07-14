import { UserRole } from '../enums/role.enum';

export class User {
  constructor(
    private readonly id: string,
    private email: string,
    private password: string | null,
    private name: string | null,
    private role:UserRole,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  // setter
  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }
  getRole(): UserRole {
    return this.role;
  }

  getPassword(): string | null {
    return this.password;
  }
  getName(): string | null {
    return this.name;
  }
 
}
