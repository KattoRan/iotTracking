import { Body, Controller, Post, Headers } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { SubmitDataDto } from './dto/submit-data.dto';

@Controller('api/v1/ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  /**
   * Header:
   *  x-device-id: <device_id>
   */
  @Post()
  ingest(
    @Body() dto: SubmitDataDto,
    @Headers('x-device-id') deviceId: string,
  ) {
    return this.ingestService.saveData(deviceId, dto);
  }
}