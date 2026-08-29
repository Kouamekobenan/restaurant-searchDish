import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { InitiatePaymentDto } from '../application/dtos/initiate-payment.dto';
import { InitiateOrderPaymentUseCase } from '../application/usecases/initiate-order-payment.usecase';
import { RefreshOrderPaymentStatusUseCase } from '../application/usecases/refresh-order-payment-status.usecase';
import { HandleJekoWebhookUseCase } from '../application/usecases/handle-jeko-webhook.usecase';
import { verifyJekoSignature } from '../infrastructure/jeko-signature.util';

@ApiTags('payments')
@Controller()
export class PaymentController {
  constructor(
    private readonly initiateOrderPaymentUseCase: InitiateOrderPaymentUseCase,
    private readonly refreshOrderPaymentStatusUseCase: RefreshOrderPaymentStatusUseCase,
    private readonly handleJekoWebhookUseCase: HandleJekoWebhookUseCase,
    private readonly configService: ConfigService,
  ) {}

  @Post('orders/:orderId/pay')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'orderId', description: 'ID de la commande' })
  @ApiOperation({ summary: "Initier le paiement Jèko d'une commande" })
  async pay(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Body() dto: InitiatePaymentDto,
  ) {
    return await this.initiateOrderPaymentUseCase.execute(
      req.user.userId,
      orderId,
      dto,
    );
  }

  @Get('orders/:orderId/payment-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'orderId', description: 'ID de la commande' })
  @ApiOperation({
    summary: 'Consulter (et rafraîchir si besoin) le statut de paiement',
  })
  async status(@Req() req: any, @Param('orderId') orderId: string) {
    return await this.refreshOrderPaymentStatusUseCase.execute(
      req.user.userId,
      orderId,
    );
  }

  @Public()
  @Post('payments/jeko/webhook')
  @ApiOperation({ summary: 'Webhook Jèko (appelé par Jèko, signé HMAC-SHA256)' })
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('jeko-signature') signature: string,
  ) {
    const secret = this.configService.get<string>('JEKO_WEBHOOK_SECRET') ?? '';

    if (!req.rawBody || !verifyJekoSignature(req.rawBody, signature, secret)) {
      res.status(401).send();
      return;
    }

    try {
      const payload = JSON.parse(req.rawBody.toString('utf8'));
      await this.handleJekoWebhookUseCase.execute(payload);
    } catch {
      // Erreur applicative déjà journalisée dans le usecase : on répond quand
      // même 200 pour éviter les relances Jèko (jusqu'à 3 tentatives sinon).
    }

    res.status(200).send();
  }
}
