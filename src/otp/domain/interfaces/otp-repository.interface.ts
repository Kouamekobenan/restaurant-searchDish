import { CreateOptDto } from 'src/otp/application/dtos/create-otp.dto';
import { Otp } from '../entities/entity';
export const OtpRepositoryName = 'IOtpRepository';
export interface IOtpRepository {
  create(createDto: CreateOptDto): Promise<Otp>;
  verify(phone: string, code: string): Promise<{ message: string }>;
}
