import { ClientsModule, Transport } from '@nestjs/microservices';

export const rabbitmq = ClientsModule.register([
  {
    name: 'PAYABLE_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
      ],
      prefetchCount: 1,
      queue: process.env.RABBITMQ_QUEUE,
      noAck: true,
      queueOptions: {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: process.env.RABBITMQ_QUEUE + '_DLQ',
        retries: 5,
        requeue: true,
      },
      maxConnectionAttempts: 3,
    },
  },
]);
