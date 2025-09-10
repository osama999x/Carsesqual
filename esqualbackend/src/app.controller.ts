import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('app')
@ApiBearerAuth()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @ApiTags('Health Check')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
