import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  IOtpRepository,
  OtpRepositoryName,
} from 'src/otp/domain/interfaces/otp-repository.interface';
import { CreateOptDto } from '../dtos/create-otp.dto';
import { Otp } from 'src/otp/domain/entities/entity';
import * as crypto from 'crypto';
@Injectable()
export class CreateOtpUseCase {
  private readonly logger = new Logger(CreateOtpUseCase.name);
  constructor(
    @Inject(OtpRepositoryName)
    private readonly otpRepository: IOtpRepository,
  ) {}
  async execute(otp: CreateOptDto): Promise<Otp> {
    try {
      const code = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      const createOpt = await this.otpRepository.create({
        phone: otp.phone,
        code: code,
        expiresAt: expiresAt,
      });
      return createOpt;
    } catch (error) {
      this.logger.error('Failled to create OTP ', error.stack);
      throw new BadRequestException('Failled to create OTP', {
        cause: error,
        description: error.message,
      });
    }
  }
}
