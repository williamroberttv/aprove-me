import { Logger, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PrismaService } from '@shared/services';
import { queueOptions } from 'config/rabbitmq/rabbitmq';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
  imports: [
    ClientsModule.register([queueOptions.payable]),
    ClientsModule.register([queueOptions.recovery]),
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, PrismaService, Logger],
})
export class IntegrationsModule {}
