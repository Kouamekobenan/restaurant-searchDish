import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { OtpController } from './presentation/otp.controller';
import { CreateOtpUseCase } from './application/usecases/create-otp.usecase';
import { OtpRepositoryName } from './domain/interfaces/otp-repository.interface';
import { OtpRepository } from './infrastructure/otp-repository.impl';
import { OtpMapper } from './domain/mappers/otp-mappers';
import { VerifyOtpUseCase } from './application/usecases/verify-otp.usecase';

@Module({
  imports: [],

  controllers: [OtpController],
  providers: [
    // serviec
    PrismaService,
    // use cases
    CreateOtpUseCase,
    VerifyOtpUseCase,
    {
      provide: OtpRepositoryName,
      useClass: OtpRepository,
    },
    //   mappers
    OtpMapper,
  ],
  exports: [],
})
export class OtpModule {}
