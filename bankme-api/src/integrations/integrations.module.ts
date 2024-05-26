import { Logger, Module } from '@nestjs/common';
import { PrismaService } from '@shared/services';
import { rabbitmq } from 'config/rabbitmq/rabbitmq';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
  imports: [rabbitmq],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, PrismaService, Logger],
})
export class IntegrationsModule {}
