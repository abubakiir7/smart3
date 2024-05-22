import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransportService } from './transport.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post()
  create(@Body() createTransportDto: CreateTransportDto) {
    return this.transportService.create(createTransportDto);
  }

  @Get()
  findAll() {
    return this.transportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransportDto: UpdateTransportDto) {
    return this.transportService.update(+id, updateTransportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportService.remove(+id);
  }
}
