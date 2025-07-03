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

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Configuration Helmet plus permissive temporairement
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
            'https://*.onrender.com', // Temporaire
            'https://*.vercel.app', // Si vous utilisez Vercel
            'https://*.netlify.app', // Si vous utilisez Netlify
          ],
        },
      },
    }),
  );

  // CORS plus permissif temporairement
  app.enableCors({
    origin: (origin, callback) => {
      console.log('Tentative de connexion depuis:', origin);

      // Autorise les requêtes sans origine (Postman, applications mobiles)
      if (!origin) return callback(null, true);

      // Liste des origines autorisées
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://restaurant-searchdish.onrender.com',
        // Ajoutez ici l'URL de votre frontend
      ];

      // Temporairement, autorise tout en développement
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error('Bloqué par CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  });

  // Filtres et guards globaux
  app.useGlobalFilters(new HttpExceptionFilter());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Authentification Swagger en production
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

  // Ajoute juste après app = await NestFactory.create(...)
  // app.set('trust proxy', 1);
  app.setGlobalPrefix('api'); // optionnel

  // Gestion des erreurs non capturées
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : configService.get<number>('PORT', 3000);

  const host = configService.get<string>('HOST', '0.0.0.0');

  try {
    await app.listen(port, host);

    const logger = new Logger('Bootstrap');
    logger.log(
      `🔑 Code swagger en production : ${process.env.SWAGGER_PASSWORD}`,
    );
    logger.log(`🚀 Application running on: ${await app.getUrl()}/api/docs`);
    logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`📡 Listening on ${host}:${port}`);
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('❌ Failed to start the server', error);
    process.exit(1);
  }
}

bootstrap();
