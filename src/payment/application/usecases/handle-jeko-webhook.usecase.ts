import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  IOrderRepository,
  OrderRepositoryName,
} from 'src/order/domain/interfaces/order-repository.interface';

interface JekoWebhookPayload {
  status: 'pending' | 'success' | 'error';
  transactionType: string;
  transactionDetails?: {
    id?: string;
    reference?: string;
    paymentLinkId?: string;
  };
}

@Injectable()
export class HandleJekoWebhookUseCase {
  private readonly logger = new Logger(HandleJekoWebhookUseCase.name);

  constructor(
    @Inject(OrderRepositoryName)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(payload: JekoWebhookPayload): Promise<void> {
   try{
 const reference = payload.transactionDetails?.reference;
 if (!reference) {
   this.logger.warn('Webhook Jèko sans référence de commande, ignoré');
   return;
 }

 const order = await this.orderRepository.getByReference(reference);
 if (!order) {
   this.logger.warn(`Aucune commande trouvée pour la référence ${reference}`);
   return;
 }

 if (order.getStatus() !== 'PENDING_PAYMENT') {
   // Statut déjà finalisé : traitement idempotent, on ignore.
   return;
 }
 if (payload.status === 'success') {
   await this.orderRepository.updateStatus(order.getId(), 'PAID');
 } else if (payload.status === 'error') {
   await this.orderRepository.updateStatus(order.getId(), 'PAYMENT_FAILED');
 }
   }catch(error){
     this.logger.error('Erreur lors du traitement du webhook Jèko', error);
     throw new Error('Erreur lors du traitement du webhook Jèko');
   }
  }
}
