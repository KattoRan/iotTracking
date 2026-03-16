import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register-device.dto';
import { DevicesService } from './devices.service';

@Controller('api/v1/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.devicesService.register(dto);
  }
}