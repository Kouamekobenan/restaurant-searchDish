export type JekoPaymentMethod = 'orange' | 'wave' | 'mtn' | 'moov' | 'djamo';
export type JekoPaymentRequestStatus = 'pending' | 'error' | 'success';

export interface CreatePaymentRequestInput {
  amountCents: number;
  currency: string;
  reference: string;
  paymentMethod: JekoPaymentMethod;
}

export interface PaymentRequestResult {
  id: string;
  status: JekoPaymentRequestStatus;
  redirectUrl: string;
}

export interface JekoStore {
  id: string;
  name: string;
}

export const PaymentGatewayName = 'IPaymentGateway';
export interface IPaymentGateway {
  createPaymentRequest(
    input: CreatePaymentRequestInput,
  ): Promise<PaymentRequestResult>;
  getPaymentRequest(
    paymentRequestId: string,
  ): Promise<{ id: string; status: JekoPaymentRequestStatus }>;
  listStores(): Promise<JekoStore[]>;
}
