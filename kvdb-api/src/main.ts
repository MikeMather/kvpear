import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

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
  await app.listen(3000);
}
bootstrap();
