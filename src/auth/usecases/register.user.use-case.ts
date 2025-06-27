import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { IUserRepository } from '../users/application/interfaces/user.interface.repository';
import { UserDto } from '../users/application/dtos/user.dto';
// import { User } from "../users/domain/entities/user.entity";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly authservice: AuthService,
  ) {}

  async execute(user: UserDto) {
    //  console.log('user register :', user)
    if (user.password.length > 6) {
      throw new BadGatewayException(
        'le mot de passe doit avoir au moins 6 lettre',
      );
    }
    let existingUser;
    try {
      existingUser = await this.userRepository.findByEmail(user.email);
      console.log('voici email....', existingUser);
    } catch (error) {
      console.error("une erreur lors d'email: ", error.message);
    }

    if (existingUser) {
      throw new BadGatewayException('user already exist!');
    }

    const haspassword = await this.authservice.hashPassword(user.password);
    let newUser;
    try {
      newUser = await this.userRepository.createUser({
        ...user,
        password: haspassword,
      });
      console.log('user save:', newUser);
    } catch (error) {
      console.error('une erreur lors de la creation de user:', error.message);
    }
    // generate token
    const token = await this.authservice.generateToken({
      userId: newUser.getId(),
      email: newUser.getEmail(),
    });
    return {
      message: 'User create succeffuly',
      token: token,
    };
  }
}
