import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MarkmapsService } from './markmaps.service';
import { MarkmapsDTO, UpdateMarkmapsDTO } from 'src/dto/markmaps.dto';
import { AuthGuard, PayloadInterface } from 'src/auth/auth.guard';

@Controller('markmaps')
export class MarkmapsController {
  constructor(private readonly markmapsService: MarkmapsService) {}

  @Post()
  async createMarkmap(@Body() markmap: MarkmapsDTO) {
    if (markmap.public > 1 || markmap.public < 0) {
      throw new BadRequestException(
        'Public must be a number between 0 and 1, cannot be a float',
      );
    }
    return await this.markmapsService.createMarkmap(markmap);
  }

  @Get('all')
  async getAllMarkmaps(@Query('maxStars') maxStars?: number) {
    if (maxStars) {
      return await this.markmapsService.getAllMarkmaps(maxStars);
    } else {
      return await this.markmapsService.getAllMarkmaps();
    }
  }

  @Get('search')
  async searchMarkmap(
    @Query('author') author?: string,
    @Query('name') name?: string,
  ) {
    const markmaps = await this.markmapsService.getMarkmapByAuthorAndName({
      author,
      name,
    });

    if (markmaps === null) {
      throw new BadRequestException(
        'It is necessary to pass data, such as the author or name of the markmap',
      );
    }

    return markmaps;
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserMarkmaps(@Request() req: PayloadInterface) {
    const markmap = await this.markmapsService.getAllMarkmapOfUser(
      req.user.sub,
    );
    if (markmap.length === 0) {
      throw new NotFoundException(
        'The user does not exist or does not have markmaps yet.',
      );
    }
    return markmap;
  }

  @Get('one/:id')
  async getOneMarkmap(@Param('id') id: string) {
    const markmapId = parseInt(id);
    if (isNaN(markmapId)) {
      throw new BadRequestException('Id must be a numeric value');
    }

    const markmap = await this.markmapsService.getOneMarkmap(markmapId);

    if (!markmap) {
      throw new NotFoundException('The markmap does not exist');
    }

    return markmap;
  }

  @UseGuards(AuthGuard)
  @Put('id')
  async updateMarkmap(
    @Param('id') id: number,
    @Body() markmap: UpdateMarkmapsDTO,
    @Request() req: PayloadInterface,
  ) {
    const update = await this.markmapsService.updateMarkmap(
      id,
      markmap,
      req.user.sub,
    );
    if (update === null) {
      throw new NotFoundException('The markmap with this id does not exist');
    }

    if (update === false) {
      throw new UnauthorizedException(
        'The bearer of the request is not equal to the user id of the markmap.',
      );
    }

    return update;
  }

  @UseGuards()
  @Delete(':id')
  async deleteMarkmap(
    @Param('id') id: number,
    @Request() req: PayloadInterface,
  ) {
    const deleteMarkmap = await this.markmapsService.deleteMarkmap(
      id,
      req.user.sub,
    );
    if (!deleteMarkmap) {
      throw new NotFoundException('The markmap with this id does not exist');
    }
    return deleteMarkmap;
  }
}
