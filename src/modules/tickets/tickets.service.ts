import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket } from './entities/ticket.entity';
import { v4 } from 'uuid';
import { log } from 'console';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket) private ticketRepo: typeof Ticket) {}

  async create(createTicketDto: CreateTicketDto) {
    createTicketDto.ticket_unique_id = v4();
    const ticket = await this.ticketRepo.create(createTicketDto);

    // sending copy of ticket if email exists
    if (createTicketDto.email) {
    }
    return ticket;
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
