import { Logger, Module } from '@nestjs/common';
import { PrismaService } from '@shared/services';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, PrismaService, Logger],
})
export class IntegrationsModule {}
