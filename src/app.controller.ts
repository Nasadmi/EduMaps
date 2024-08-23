import { Controller, Get, Render } from '@nestjs/common';
import { MarkmapsService } from './markmaps/markmaps.service';

@Controller()
export class AppController {
  constructor(private readonly markmapsService: MarkmapsService) {}

  @Get()
  @Render('index')
  async root() {
    return { allMarkmaps: await this.markmapsService.getAllMarkmaps() };
  }
}
