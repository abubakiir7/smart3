import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [SequelizeModule.forFeature([Ticket])] ,
  providers: [TicketsService],
  exports: [TicketsService]
})
export class TicketsModule {}
