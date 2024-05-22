import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { UpdateJourneyDto } from './dto/update-journey.dto';
import { BookingJourneyDto } from './dto/booking-journey.dto';
import { log } from 'console';

@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Post()
  create(@Body() createJourneyDto: CreateJourneyDto) {
    return this.journeyService.create(createJourneyDto);
  }

  @Get()
  findAll() {
    return this.journeyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journeyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJourneyDto: UpdateJourneyDto) {
    return this.journeyService.update(+id, updateJourneyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journeyService.remove(+id);
  }

  @Post('booking')
  booking(@Body() bookingDto: BookingJourneyDto) {
    return this.journeyService.book(bookingDto)
  }
}
