import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOtpUseCase } from '../application/usecases/create-otp.usecase';
import { CreateOptDto } from '../application/dtos/create-otp.dto';
import { Otp } from '../domain/entities/entity';
import { VerifyOtpUseCase } from '../application/usecases/verify-otp.usecase';
import { OtpVerifyDto } from '../application/dtos/verify-otp.dto';

@Controller('otp')
@ApiTags('NOTIFICATION OTP')
export class OtpController {
  constructor(
    private readonly createOtpUseCase: CreateOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Génère et envoie un code OTP par SMS' })
  @ApiBody({ type: CreateOptDto, description: 'Numéro de téléphone du client' })
  @ApiResponse({
    status: 201,
    description: 'OTP généré et envoyé avec succès',
    type: Otp,
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide (numéro incorrect ou OTP non généré)',
  })
  async create(@Body() otp: CreateOptDto): Promise<Otp> {
    return await this.createOtpUseCase.execute(otp);
  }
  @Post('verify')
  @ApiOperation({ summary: 'Vérifie un code OTP pour un numéro de téléphone' })
  @ApiResponse({
    status: 200,
    description: 'OTP validé avec succès',
    schema: { example: { message: 'OTP validé 🎉' } },
  })
  @ApiResponse({ status: 400, description: 'OTP invalide ou expiré' })
  async verify(@Body() dto: OtpVerifyDto) {
    return await this.verifyOtpUseCase.execute(dto.phone, dto.code);
  }
}
