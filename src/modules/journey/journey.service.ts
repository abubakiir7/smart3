import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { UpdateJourneyDto } from './dto/update-journey.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Journey } from './entities/journey.entity';
import { TripService } from '../trip/trip.service';
import { Op } from 'sequelize';
import * as sequelize from 'sequelize';
import { User } from '../user/entities/user.entity';
import { BookingJourneyDto } from './dto/booking-journey.dto';
import { Trip } from '../trip/entities/trip.entity';
import { TicketsService } from '../tickets/tickets.service';
import { log } from 'console';
import { Transport } from '../transport/entities/transport.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class JourneyService {
  constructor(
    @InjectModel(Journey) private journeyRepo: typeof Journey,
    private readonly tripService: TripService,
    @InjectModel(User) private userRepo: typeof User,
    private readonly ticketService: TicketsService,
    @InjectModel(Transport) private readonly transportRepo: typeof Transport,
  ) {}

  async create(createJourneyDto: CreateJourneyDto) {
    const { trips, transport_id } = createJourneyDto;
    if (!(await this.transportRepo.findByPk(transport_id)))
      return { status: 'failed', message: 'the transport not cretaed yet' };
    const beginning = trips[0].beginning_time;
    const ending = trips[trips.length - 1].ending_time;

    // Check for transport availability
    const busyJourneys = await Promise.all(
      trips.map(async (trip) => {
        return await this.journeyRepo.findAll({
          where: {
            transport_id,
            beginning_time: { [Op.lt]: ending },
            ending_time: { [Op.gt]: beginning },
          },
        });
      }),
    );

    if (busyJourneys.some((journeys) => journeys.length > 0)) {
      return {
        status: 'failed',
        message: 'The transport is busy at those times',
      };
    }

    // Creating journey
    const journeyCreation = {
      origin: trips[0].from,
      destination: trips[trips.length - 1].to,
      beginning_time: beginning,
      ending_time: ending,
      transport_id: transport_id,
    };
    const journey = await this.journeyRepo.create(journeyCreation, {
      returning: true,
    });

    // Creating the legs
    await Promise.all(
      trips.map((trip) => {
        return this.tripService.create({ ...trip, journey_id: journey.id });
      }),
    );

    return {
      status: 'success',
      message: 'Journey created successfully',
      journey,
    };
  }

  async findAll() {
    // getting all journeys
    const journeys = await this.journeyRepo.findAll({ include: { all: true } });
    if (journeys.length)
      return {
        status: 'success',
        message: 'all trips',
        journeys,
      };
    return {
      status: 'failed',
      message: 'there is no trips',
    };
  }

  async findOne(id: number) {
    // getting one journey by id
    const journey = await this.journeyRepo.findByPk(+id);
    if (!journey) throw new BadRequestException('the id is not valid');
    return journey;
  }

  update(id: number, updateJourneyDto: UpdateJourneyDto) {
    return `This action updates a #${id} journey`;
  }

  async remove(id: number) {
    // creating clone to return deleted journey
    const deleted_trip = await this.journeyRepo.findByPk(+id, {
      include: { all: true },
    });
    // deleting the journey
    await this.journeyRepo.destroy({ where: { id } });
    return {
      status: 'success',
      message: 'deleted successfully',
      deleted_trip,
    };
  }

  async book(bookingDto: BookingJourneyDto) {
    const tickets = [];
    for (let ind = 0; ind < bookingDto.passangers.length; ind++) {
      const TRIPS = bookingDto.passangers[ind].trip_ids.map((i) => i[0]);

      if (!(await this.journeyRepo.findAll({ where: { id: TRIPS } })))
        return {
          status: 'failed',
          message: 'the trip was deleted',
        };
      if (!(await this.userRepo.findByPk(bookingDto.user_id))?.phone)
        return {
          status: 'failed',
          messgae: 'phone number required to book',
        };
      const trips = await Trip.findAll({
        where: { id: TRIPS },
        include: { model: Journey, include: [Transport] },
      });
      let shouldReturn = false;
      for (let ind = 0; ind < bookingDto.passangers.length; ind++) {
        const passenger = bookingDto.passangers[ind];
        for (let index = 0; index < passenger.trip_ids.length; index++) {
          const trip = trips[index];
          const seatsToCheck = passenger.trip_ids[index][1];
          for (const seatToCheck of seatsToCheck) {
            if (
              trip.journey.transport.seats < 1 + trip.passangers ||
              trip.seats.includes(seatToCheck)
            ) {
              shouldReturn = true;
              break;
            }
          }

          if (shouldReturn) {
            break;
          }
        }

        if (shouldReturn) {
          break;
        }
      }

      if (shouldReturn) {
        return {
          status: 'failed',
          message:
            'There are not enough seats available or the seat is already booked.',
        };
      }

      const creation_ticket = {
        user_id: bookingDto.user_id,
        first_name: bookingDto.passangers[ind].first_name,
        last_name: bookingDto.passangers[ind].last_name,
        phone: bookingDto.passangers[ind].phone,
        email: bookingDto.passangers[ind].email
          ? bookingDto.passangers[ind].email
          : undefined,
        trip_ids: [],
        seat_ids: [],
      };

      creation_ticket.trip_ids.push(...TRIPS);
      creation_ticket.seat_ids.push(
        ...bookingDto.passangers[ind].trip_ids.map((k) => k[1]),
      );

      const ticket = await this.ticketService.create(creation_ticket);

      tickets.push({
        ticket,
      });
      for (let g = 0; g < ticket.trip_ids.length; g++) {
        await Trip.update(
          {
            seats: Sequelize.literal(`seats || ARRAY[${ticket.seat_ids[g]}]`),
          },
          { where: { id: ticket.trip_ids[g] } },
        );
      }
    }
    // this.mailService.sendMailClient("smart", "")
    return {
      status: 'success',
      message: 'ticket booked successfully',
      tickets,
    };
  }
}
