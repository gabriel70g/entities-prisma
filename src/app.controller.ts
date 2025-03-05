import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): string {
    return this.appService.health();
  }
  @Get('healthCheck')
  @UseInterceptors()
  healthCheck(): string {
    return "OK!!";
  }
}
