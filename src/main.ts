import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { RolesGuard } from './auth/guards/role.guard';
import helmet from 'helmet';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  // ✅ Helmet avec contentSecurityPolicy correct
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
          ],
        },
      },
    }),
  );
  const configService = app.get(ConfigService);
  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : configService.get<number>('PORT', 3000);

  const host = configService.get<string>('HOST', '0.0.0.0');
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // ✅ Configuration CORS pour le frontend Electron/Next.js
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://restaurant-searchdish.onrender.com',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  });
  // ✅ Filtres et guards globaux
  app.useGlobalFilters(new HttpExceptionFilter());
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  console.log('=== DATABASE DEBUG ===');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('Connecting to database...');

  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('Api Findi')
    .setDescription('API gestion de restaurant et des plats')
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
  //Uploader les images avec multer
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // rend accessible via http://localhost:3000/uploads/...
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  try {
    const logger = new Logger('Bootstrap');

    const port = configService.get('PORT') || 3000;
    await app.listen(port);

    logger.log(
      `🚀 Application running on: http://localhost:${port}/${apiPrefix}`,
    );
    logger.log(
      `📖 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`,
    );
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('❌ Failed to start the server', error);
    process.exit(1);
  }
}
bootstrap();
