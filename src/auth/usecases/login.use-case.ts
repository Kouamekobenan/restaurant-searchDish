import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../users/application/interfaces/user.interface.repository';
import { User } from '../users/domain/entities/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly authservice: AuthService,
  ) {}


  async execute(
    phone: string,
    password: string,
  ): Promise<{ user: User; token: {} }> {
    const isUser = await this.userRepository.findByPhone(phone);
    if (!isUser) {
      throw new Error(`ce email:${phone} est incorrect`);
    }

    const isComparePassword = await this.authservice.comparePassword(
      password,
      isUser.getPassword()!,
    );
    if (!isComparePassword) {
      throw new Error(`ce password:${password} est incorrect`);
    }
    if (isUser.Phone == undefined) {
      throw new BadRequestException(`Phone is undefined!`);
    }
    const generateToken = await this.authservice.generateToken({
      userId: isUser.getId(),
      phone: isUser.Phone,
      role: isUser.getRole(),
    });

    return { user: isUser, token: generateToken };
  }
}
