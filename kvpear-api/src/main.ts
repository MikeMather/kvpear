import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet'

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
  app.register(helmet);
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: 'Content-Type, api-key, origin',
  });
  await app.listen(8080);
}
bootstrap();
