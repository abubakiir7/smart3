import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transport } from './entities/transport.entity';
import { Seats } from './entities/seats.entity';

@Module({
  imports: [SequelizeModule.forFeature([Transport, Seats])],
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
