import { Controller, Get, Param, Query } from '@nestjs/common';
import { BtsService } from './bts.service';
import { MapQueryDto } from './dto/map-query.dto';

@Controller('api/v1/bts')
export class BtsController {
  constructor(private readonly btsService: BtsService) {}

  /**
   * MAP API
   * GET /api/v1/bts/map?west=&south=&east=&north=&zoom=
   */
  @Get('map')
  getForMap(@Query() query: MapQueryDto) {
    return this.btsService.getForMap(query);
  }

  /**
   * BTS DETAIL
   * GET /api/v1/bts/:id
   */
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.btsService.getDetail(Number(id));
  }
}