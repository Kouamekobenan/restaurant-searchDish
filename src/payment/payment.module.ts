import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { PaymentController } from './presentation/payment.controller';
import { PaymentGatewayName } from './domain/interfaces/payment-gateway.interface';
import { JekoPaymentService } from './infrastructure/jeko-payment.service';
import { InitiateOrderPaymentUseCase } from './application/usecases/initiate-order-payment.usecase';
import { RefreshOrderPaymentStatusUseCase } from './application/usecases/refresh-order-payment-status.usecase';
import { HandleJekoWebhookUseCase } from './application/usecases/handle-jeko-webhook.usecase';
import { ListJekoStoresUseCase } from './application/usecases/list-jeko-stores.usecase';

@Module({
  imports: [OrderModule],
  controllers: [PaymentController],
  providers: [
    InitiateOrderPaymentUseCase,
    RefreshOrderPaymentStatusUseCase,
    HandleJekoWebhookUseCase,
    ListJekoStoresUseCase,
    {
      provide: PaymentGatewayName,
      useClass: JekoPaymentService,
    },
  ],
})
export class PaymentModule {}
