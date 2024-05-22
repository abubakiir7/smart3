import { Injectable } from '@nestjs/common';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transport } from './entities/transport.entity';
import { Seats } from './entities/seats.entity';

@Injectable()
export class TransportService {
  constructor(
    @InjectModel(Transport) private transportRepo: typeof Transport,
    @InjectModel(Seats) private seatRepo: typeof Seats,
  ) {}

  async create(createTransportDto: CreateTransportDto) {
    createTransportDto.seats = createTransportDto.column * createTransportDto.raw
    const response = {
      status: 'success',
      message: 'transport created successfully',
      transport: await this.transportRepo.create(createTransportDto),
    };
    for (let i = 0; i < response.transport.raw * response.transport.column; i++)
      this.seatRepo.create({ transport_id: response.transport.id });
    return response;
  }

  async findAll() {
    const transport = await this.transportRepo.findAll({
      include: { all: true },
    });
    if (transport)
      return {
        status: 'success',
        message: 'fetched transports',
        transport,
      };
    return {
      status: 'failed',
      message: 'there is no transports',
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} transport`;
  }

  update(id: number, updateTransportDto: UpdateTransportDto) {
    return `This action updates a #${id} transport`;
  }

  remove(id: number) {
    return `This action removes a #${id} transport`;
  }
}
