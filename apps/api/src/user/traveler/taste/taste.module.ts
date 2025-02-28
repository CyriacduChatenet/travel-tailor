import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasteService } from './taste.service';
import { TasteController } from './taste.controller';
import { Taste } from './entities/taste.entity';
import { TasteRepository } from './taste.repository';
import { TravelerModule } from '../traveler.module';

@Module({
  imports: [TypeOrmModule.forFeature([Taste]), TravelerModule],
  controllers: [TasteController],
  providers: [TasteRepository, TasteService],
})
export class TasteModule {}
