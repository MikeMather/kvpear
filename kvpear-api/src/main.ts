import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // 4kb
  const bodyLimit = 4 * 1024;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, bodyLimit }),
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
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: 'Content-Type, api-key, origin',
  });
  await app.listen(8080, '0.0.0.0');
}
bootstrap();
