import { CreateOptDto } from 'src/otp/application/dtos/create-otp.dto';
import { Otp } from '../entities/entity';
import { OtpCode, Prisma } from '@prisma/client';

export class OtpMapper {
  toEntity(otp: OtpCode): Otp {
    return new Otp(
      otp.id,
      otp.phone,
      otp.code,
      otp.expiresAt,
      otp.isUsed,
      otp.createdAt,
    );
  }
  toPersitence(otp: CreateOptDto): Prisma.OtpCodeCreateInput {
    return {
      phone: otp.phone,
      code: otp.code,
      expiresAt: otp.expiresAt,
    };
  }
}
