import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../users/application/interfaces/user.interface.repository';

@Injectable()
export class UpdateRoleUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      await this.userRepo.updateRole(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
