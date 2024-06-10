import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Devices')
@Controller('devices')
export class DevicesController {
  constructor() {}

  async getDevices() {}
}
