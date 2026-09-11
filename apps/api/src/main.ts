import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DbRetryInterceptor } from './common/interceptors/db-retry.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Hosts like Render terminate traffic at a load balancer, so every request
  // reaches Express from the proxy's address. Trusting one hop makes req.ip
  // the real client from X-Forwarded-For. Without it the rate limiter keys
  // every visitor to the same IP, and five failed logins anywhere lock out
  // everyone. Controlled by TRUST_PROXY so local development is unaffected.
  const trustProxy = process.env.TRUST_PROXY;
  if (trustProxy) {
    app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);
  }

  // Security Middleware
  // crossOriginResourcePolicy is relaxed so images served from
  // /api/v1/public/uploads/* can be embedded by the website and CMS,
  // which run on different origins in development.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // Cap request bodies. Express defaults to 100kb for JSON but is unbounded
  // for urlencoded extended payloads, and an unbounded body is a cheap DoS.
  // File uploads go through multer, which enforces its own limit.
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // CORS — driven by the ALLOWED_ORIGINS env var (comma-separated).
  // Falls back to the local website (3000) and CMS (3001) dev servers.
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000,http://localhost:3001'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, Postman, server-to-server) which
      // send no Origin header, plus any explicitly allowed origin.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Interceptors and Filters
  // Order matters: the retry must wrap the handler, so it comes first.
  // TransformInterceptor reads @SkipTransform metadata, so it needs the
  // Reflector from the DI container.
  app.useGlobalInterceptors(
    new DbRetryInterceptor(),
    new TransformInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('RedFort CMS API')
    .setDescription('The API documentation for RedFort CMS Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  // The API docs enumerate every endpoint and schema. Useful in development,
  // an unnecessary disclosure in production, so keep them opt-in there.
  const exposeDocs =
    process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true';
  if (exposeDocs) {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Fail fast on an unreachable database rather than serving 500s.
  app.enableShutdownHooks();

  const port = process.env.PORT || 5000;
  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`API listening on http://localhost:${port}/api/v1`);
  if (exposeDocs) {
    logger.log(`Swagger docs at  http://localhost:${port}/api/docs`);
  }
  logger.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
}

bootstrap().catch((error) => {
  // Without this a failed bootstrap (bad JWT_SECRET, unreachable database)
  // produces an unhandled rejection and an exit code that looks like success.
  new Logger('Bootstrap').error('Failed to start the application', error);
  process.exit(1);
});
