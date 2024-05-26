import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
      ],
      queue: process.env.RABBITMQ_QUEUE,
      noAck: true,
      prefetchCount: 50,
      queueOptions: {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: process.env.RABBITMQ_QUEUE + '_DLQ',
        retries: 5,
        requeue: true,
      },
      maxConnectionAttempts: 3,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
