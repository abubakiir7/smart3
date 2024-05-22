import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Journey } from './entities/journey.entity';
import { TripModule } from '../trip/trip.module';
import { User } from '../user/entities/user.entity';
import { TicketsModule } from '../tickets/tickets.module';
import { Transport } from '../transport/entities/transport.entity';

@Module({
  imports: [SequelizeModule.forFeature([Journey, User, Transport]), TripModule, TicketsModule],
  controllers: [JourneyController],
  providers: [JourneyService],
})
export class JourneyModule {}
