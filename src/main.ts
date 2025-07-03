import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/role.guard';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // 🔐 Helmet + CSP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: [
            "'self'",
            'http://localhost:3000',
            'http://localhost:5173',
            'https://restaurant-searchdish.onrender.com',
            'https://*.onrender.com',
            'https://*.vercel.app',
            'https://*.netlify.app',
          ],
        },
      },
    }),
  );

  // ✅ CORS configuration propre
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://restaurant-searchdish.onrender.com',
    'https://restaurant-searchdish.vercel.app', // si applicable
  ];

  app.enableCors({
    origin: (origin, callback) => {
      console.log('Tentative de connexion depuis:', origin);

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn('🚫 Origine bloquée par CORS :', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  // Filtres et guards globaux
  app.useGlobalFilters(new HttpExceptionFilter());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // 🔐 Swagger Basic Auth en production
  if (process.env.NODE_ENV === 'production') {
    app.use(
      ['/api/docs', '/api/docs-json'],
      basicAuth({
        users: {
          [configService.get('SWAGGER_USER') || 'admin']:
            configService.get('SWAGGER_PASSWORD') || 'admin12',
        },
        challenge: true,
      }),
    );
  }

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API FINDI')
    .setDescription(
      "API de gestion de recherche de plat d'un restaurant dans une localité donnée",
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 🔧 Optionnel : préfixe global
  app.setGlobalPrefix('api');

  // 🔒 Trust proxy si hébergé sur Render
  app.set('trust proxy', 1);

  // Gestion des erreurs process
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
  });

  const port =
    parseInt(process.env.PORT || '3000', 10) ||
    configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', '0.0.0.0');

  try {
    await app.listen(port, host);

    const logger = new Logger('Bootstrap');
    logger.log(`🔑 Code swagger : ${process.env.SWAGGER_PASSWORD}`);
    logger.log(`🚀 App running on: ${await app.getUrl()}/api/docs`);
    logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`📡 Listening on ${host}:${port}`);
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('❌ Server start failed', error);
    process.exit(1);
  }
}

bootstrap();
