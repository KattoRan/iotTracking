import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevicesModule } from './devices/devices.module';
import { IngestController } from './ingest/ingest.controller';
import { IngestService } from './ingest/ingest.service';
import { BtsController } from './bts/bts.controller';
import { BtsService } from './bts/bts.service';
import { WebController } from './web/web.controller';
import { WebService } from './web/web.service';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [DevicesModule, PrismaModule, EventsModule],
  controllers: [AppController, IngestController, BtsController, WebController],
  providers: [AppService, IngestService, BtsService, WebService],
})
export class AppModule {}
