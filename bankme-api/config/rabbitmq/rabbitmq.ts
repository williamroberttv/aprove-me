import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { RABBITMQ_QUEUE, RABBITMQ_QUEUE_DLQ } from '@shared/utils';

const payable: ClientProviderOptions = {
  name: RABBITMQ_QUEUE,
  transport: Transport.RMQ,
  options: {
    urls: [
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
    ],
    prefetchCount: 1,
    queue: RABBITMQ_QUEUE,
    queueOptions: {
      durable: true,
      deadLetterExchange: '',
      deadLetterRoutingKey: RABBITMQ_QUEUE + '_DLQ',
    },
  },
};

const recovery: ClientProviderOptions = {
  name: RABBITMQ_QUEUE_DLQ,
  transport: Transport.RMQ,
  options: {
    urls: [
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
    ],
    queue: RABBITMQ_QUEUE_DLQ,
    queueOptions: {
      durable: true,
    },
  },
};

export const queueOptions = {
  payable,
  recovery,
};
