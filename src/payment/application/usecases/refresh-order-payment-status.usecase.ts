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
import { Order } from 'src/order/domain/entities/order.entity';

@Injectable()
export class RefreshOrderPaymentStatusUseCase {
  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
    @Inject(PaymentGatewayName)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.getById(orderId);
    if (order.getUserId() !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas consulter cette commande');
    }

    if (order.getStatus() !== 'PENDING_PAYMENT') {
      return order;
    }
    const jekoPaymentRequestId = order.getJekoPaymentRequestId();
    if (!jekoPaymentRequestId) {
      throw new BadRequestException(
        "Aucun paiement n'a encore été initié pour cette commande",
      );
    }

    const paymentRequest = await this.paymentGateway.getPaymentRequest(
      jekoPaymentRequestId,
    );

    if (paymentRequest.status === 'success') {
      return await this.orderRepository.updateStatus(order.getId(), 'PAID');
    }
    if (paymentRequest.status === 'error') {
      return await this.orderRepository.updateStatus(
        order.getId(),
        'PAYMENT_FAILED',
      );
    }
    return order;
  }
}
