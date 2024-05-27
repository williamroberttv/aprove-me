export const MAX_RETRIES = 4;
export const MAX_BATCHES = 10000;

export const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE;
export const RABBITMQ_QUEUE_DLQ = process.env.RABBITMQ_QUEUE + '_DLQ';
