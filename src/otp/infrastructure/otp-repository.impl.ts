import { BadRequestException, Injectable } from '@nestjs/common';
import { IOtpRepository } from '../domain/interfaces/otp-repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { OtpMapper } from '../domain/mappers/otp-mappers';
import { CreateOptDto } from '../application/dtos/create-otp.dto';
import { Otp } from '../domain/entities/entity';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: OtpMapper,
  ) {}
  async create(createDto: CreateOptDto): Promise<Otp> {
    const otp = this.mapper.toPersitence(createDto);
    const createOtp = await this.prisma.otpCode.create({
      data: otp,
    });
    return this.mapper.toEntity(createOtp);
  }
  async verify(phone: string, code: string): Promise<{ message: string }> {
    const otp = await this.prisma.otpCode.findFirst({
      where: { phone, code, isUsed: false },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!otp) throw new BadRequestException('Code invalide');
    if (otp.expiresAt < new Date())
      throw new BadRequestException('Code expiré');

    await this.prisma.otpCode.update({
      where: { id: otp?.id },
      data: { isUsed: true },
    });
    return {message:"OTP validé 🎉"}
  }
}
