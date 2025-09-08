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

@Injectable()
export class VerifyOtpUseCase {
  private readonly logger = new Logger(VerifyOtpUseCase.name);
  constructor(
    @Inject(OtpRepositoryName)
    private readonly otpRepository: IOtpRepository,
  ) {}
  async execute(phone: string, code: string) {
    try {
      return await this.otpRepository.verify(phone, code);
    } catch (error) {
      try {
      } catch (error) {
        this.logger.error('Failled to veirfy OTP', error.stack);
        throw new BadRequestException('Failled to verify OTP', {
          cause: error,
          description: error,
        });
      }
    }
  }
}
