import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
} from 'src/order/domain/interfaces/order-repository.interface';
import {
  IPaymentGateway,
  PaymentGatewayName,
} from 'src/payment/domain/interfaces/payment-gateway.interface';
import { InitiatePaymentDto } from '../dtos/initiate-payment.dto';

@Injectable()
export class InitiateOrderPaymentUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
    @Inject(PaymentGatewayName)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(
    userId: string,
    orderId: string,
    dto: InitiatePaymentDto,
  ): Promise<{ redirectUrl: string }> {
    const order = await this.orderRepository.getById(orderId);

    if (order.getUserId() !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas payer cette commande');
    }
    if (order.getStatus() !== 'PENDING_PAYMENT') {
      throw new BadRequestException(
        `Cette commande ne peut plus être payée (statut: ${order.getStatus()})`,
      );
    }

    const paymentRequest = await this.paymentGateway.createPaymentRequest({
      amountCents: order.getTotalAmountCents(),
      currency: order.getCurrency(),
      reference: order.getReference(),
      paymentMethod: dto.paymentMethod,
      orderId: order.getId(),
    });

    await this.orderRepository.updatePaymentRequest(
      order.getId(),
      dto.paymentMethod,
      paymentRequest.id,
    );

    return { redirectUrl: paymentRequest.redirectUrl };
  }
}
