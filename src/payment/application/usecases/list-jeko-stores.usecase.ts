import { Inject, Injectable } from '@nestjs/common';
import {
  IPaymentGateway,
  JekoStore,
  PaymentGatewayName,
} from 'src/payment/domain/interfaces/payment-gateway.interface';

@Injectable()
export class ListJekoStoresUseCase {
  constructor(
    @Inject(PaymentGatewayName)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(): Promise<JekoStore[]> {
    return await this.paymentGateway.listStores();
  }
}
