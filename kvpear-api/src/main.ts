import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const corsOptions = {
  origin: '*',
  methods: '*',
  allowedHeaders: 'Content-Type, x-api-key, origin',
}

async function bootstrap() {
  // 32kb
  const bodyLimit = 32 * 1024;
  const adapter = new FastifyAdapter({ logger: true, bodyLimit });
  adapter.enableCors(corsOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      rawBody: true
    }
  );

  const documentationConfig = new DocumentBuilder()
    .setTitle('KVPEAR API')
    .setDescription('KVPEAR API description')
    .setVersion('1.0')
    .addTag('kvpear')
    .build();
  const document = SwaggerModule.createDocument(app, documentationConfig);
  SwaggerModule.setup('documentation', app, document);

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  });
  await app.listen(8080, '0.0.0.0');
}
bootstrap();
