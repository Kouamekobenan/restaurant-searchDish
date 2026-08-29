import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  CreatePaymentRequestInput,
  IPaymentGateway,
  JekoPaymentRequestStatus,
  JekoStore,
  PaymentRequestResult,
} from '../domain/interfaces/payment-gateway.interface';

@Injectable()
export class JekoPaymentService implements IPaymentGateway {
  private readonly logger = new Logger(JekoPaymentService.name);
  private readonly client: AxiosInstance;
  private readonly storeId: string;
  private readonly successUrl: string;
  private readonly errorUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.client = axios.create({
      baseURL: this.configService.get<string>(
        'JEKO_BASE_URL',
        'https://api.jeko.africa',
      ),
      headers: {
        'X-API-KEY': this.configService.get<string>('JEKO_API_KEY'),
        'X-API-KEY-ID': this.configService.get<string>('JEKO_API_KEY_ID'),
        'Content-Type': 'application/json',
      },
    });
    this.storeId = this.configService.get<string>('JEKO_STORE_ID') ?? '';
    this.successUrl = this.configService.get<string>('JEKO_SUCCESS_URL') ?? '';
    this.errorUrl = this.configService.get<string>('JEKO_ERROR_URL') ?? '';
  }

  async createPaymentRequest(
    input: CreatePaymentRequestInput,
  ): Promise<PaymentRequestResult> {
    try {
      const { data } = await this.client.post('/partner_api/payment_requests', {
        storeId: this.storeId,
        amountCents: input.amountCents,
        currency: input.currency,
        reference: input.reference,
        paymentDetails: {
          type: 'redirect',
          data: {
            paymentMethod: input.paymentMethod,
            successUrl: this.successUrl,
            errorUrl: this.errorUrl,
          },
        },
      });
      return { id: data.id, status: data.status, redirectUrl: data.redirectUrl };
    } catch (error) {
      this.logger.error(
        'Failed to create Jeko payment request',
        error?.response?.data ?? error.stack,
      );
      throw new InternalServerErrorException(
        'Échec de la création de la demande de paiement',
        { cause: error, description: error.message },
      );
    }
  }

  async getPaymentRequest(
    paymentRequestId: string,
  ): Promise<{ id: string; status: JekoPaymentRequestStatus }> {
    try {
      const { data } = await this.client.get(
        `/partner_api/payment_requests/${paymentRequestId}`,
      );
      return { id: data.id, status: data.status };
    } catch (error) {
      this.logger.error(
        'Failed to fetch Jeko payment request',
        error?.response?.data ?? error.stack,
      );
      throw new InternalServerErrorException(
        'Échec de la récupération du statut du paiement',
        { cause: error, description: error.message },
      );
    }
  }

  async listStores(): Promise<JekoStore[]> {
    try {
      const { data } = await this.client.get('/partner_api/stores');
      return data.map((store: any) => ({ id: store.id, name: store.name }));
    } catch (error) {
      this.logger.error(
        'Failed to list Jeko stores',
        error?.response?.data ?? error.stack,
      );
      throw new InternalServerErrorException(
        'Échec de la récupération des magasins Jèko',
        { cause: error, description: error.message },
      );
    }
  }
}
