import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Trip } from './entities/trip.entity';
import { Transport } from '../transport/entities/transport.entity';

@Module({
  imports: [SequelizeModule.forFeature([Trip])],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService]
})
export class TripModule {}
