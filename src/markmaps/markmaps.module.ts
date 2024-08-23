import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Markmaps } from 'src/entities/markmaps.entity';
import { MarkmapsService } from './markmaps.service';
import { MarkmapsController } from './markmaps.controller';
import { MarkmapsSubscriber } from 'src/subscribers/markmaps.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Markmaps])],
  providers: [MarkmapsService, MarkmapsSubscriber],
  controllers: [MarkmapsController],
  exports: [MarkmapsService],
})
export class MarkmapsModule {}
