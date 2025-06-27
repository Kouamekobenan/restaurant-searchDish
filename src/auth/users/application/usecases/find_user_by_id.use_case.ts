import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user.interface.repository';
import { User } from '../../domain/entities/user.entity';
@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(userId: string): Promise<User> {
    console.log('userId use-case', userId);
    try {
      if (!userId || typeof userId !== 'string') {
        throw new BadRequestException('ID invalid');
      }
      return this.userRepository.getUserById(userId);
    } catch (error) {
      throw new BadRequestException(`token not found : ${error.message}`);
    }
  }
}
