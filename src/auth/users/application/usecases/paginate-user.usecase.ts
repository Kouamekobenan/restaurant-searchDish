import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user.interface.repository';

@Injectable()
export class PaginateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(limit: number, page: number) {
    try {
      const users = await this.userRepository.paginate(limit, page);
      return users;
    } catch (error) {
      throw new BadRequestException('Failed to paginate user ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
