import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Trip } from './entities/trip.entity';
import { DATE, Op } from 'sequelize';
import { FindTripDto } from './dto/find-trip.dto';
import { log } from 'console';
import { Transport } from '../transport/entities/transport.entity';
import { Journey } from '../journey/entities/journey.entity';

@Injectable()
export class TripService {
  constructor(@InjectModel(Trip) private tripRepo: typeof Trip) {}

  async create(createTripDto: CreateTripDto) {
    // creating trip
    return {
      status: 'success',
      message: 'created successfully',
      trip: await this.tripRepo.create(createTripDto),
    };
  }

  async findAllNotBeginRoutes() {
    // getting not begun routes
    const trips = await this.tripRepo.findAll({
      where: {
        beginning_time: { [Op.gt]: new Date() },
      },
      include: [{ model: Journey }],
    });

    const journeys: Journey[] = trips.map(trip => trip.journey)
    log(journeys)

    if (trips.length)
      return {
        status: 'success',
        message: 'all not begin trips',
        journeys,
      };
    return {
      status: 'failed',
      message: 'there is no trips in row',
    };
  }

  async findTripsInActive() {
    // getting all active trips which is not route
    const trips = await this.tripRepo.findAll({
      where: {
        [Op.and]: [
          { beginning_time: { [Op.lt]: new Date() } },
          { ending_time: { [Op.gt]: new Date() } },
        ],
      },
      include: { all: true },
    });
    if (trips.length)
      return {
        status: 'success',
        message: 'all active trips',
        trips: await trips['journey'],
      };
    return {
      status: 'failed',
      message: 'there is no active trips',
    };
  }

  async findAll() {
    // getting all routes all history
    const trips = this.tripRepo.findAll({});
    if ((await trips).length)
      return {
        status: 'success',
        message: 'all trips',
        trips,
      };
    return {
      status: 'failed',
      message: 'there is no trips',
    };
  }

  async findOne(id: number) {
    // getting one trip by id
    const trip = await this.tripRepo.findByPk(+id);
    if (!trip) throw new BadRequestException('the id is not valid');
    return trip;
  }

  async update(id: number, updateTripDto: UpdateTripDto) {
    // update the trip
    return {
      status: 'success',
      message: 'updated successfully',
      trip: await this.tripRepo.update(updateTripDto, {
        where: { id },
        returning: true,
      }),
    };
    // sending notification to bookeed people

    // and asking if they are agree with that
    // if transfers is not correct offer another route if exists
  }

  async remove(id: number) {
    // creating clone to return deleted trip
    const deleted_trip = await this.tripRepo.findByPk(+id);
    // deleting the route
    await this.tripRepo.destroy({ where: { id } });
    return {
      status: 'success',
      message: 'deleted successfully',
      deleted_trip,
    };
  }

  async findTrip(findTripDto: FindTripDto) {
    // Define the journey details
    interface Trip {
      id: number;
      origin: string;
      destination: string;
      departureDateTime: string;
      arrivalDateTime: string;
      price: number;
      passangers: number;
      seats: number;
      boarding: number;
    }

    interface Journey {
      trips: Trip[];
      startDate: string;
      startPoint?: string;
      endPoint?: string;
      passangers?: number;
    }

    // Function to convert time string to timestamp
    function convertToTimestamp(dateString: string): number {
      return new Date(dateString).getTime();
    }

    // fetching from database all trips
    async function getTripsInFormat() {
      try {
        // Fetch trips from the database
        const trips = await Trip.findAll({
          include: { model: Journey, include: [Transport] },
        });

        // Map the fetched trips to the desired format
        const formattedTrips = trips.map((trip) => ({
          id: trip.id,
          origin: trip.from,
          destination: trip.to,
          departureDateTime: trip.beginning_time.toISOString(), // Convert to ISO string format
          arrivalDateTime: trip.ending_time.toISOString(), // Convert to ISO string format
          price: trip.price,
          passangers: trip.passangers,
          seats: trip.journey.transport.seats,
          boarding: trip.boarding,
        }));

        // Return the formatted trips
        return formattedTrips;
      } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
      }
    }
    let all_trips = await getTripsInFormat();
    const journey: Journey = {
      trips: all_trips,
      startDate: findTripDto.departing
        ? new Date(new Date(findTripDto.departing)).toISOString()
        : new Date().toISOString(),
    };

    // Function to check if the journey is possible
    async function planJourney(journey: Journey) {
      const { trips, startPoint, endPoint, startDate, passangers } = journey;

      if (!trips || trips.length === 0) {
        console.error('No trips provided.');
        return [];
      }

      const allRoutes: {
        path: string[];
        price: number;
        tripIds: any;
        transfers?: any;
        boardings: number[];
      }[] = [];

      async function dfs(
        currentPoint: string,
        currentPath: string[],
        currentTime: string,
        currentPrice: number,
        currentTripIds: {
          id: number;
          departureTime: string;
          arrivalTime: string;
        }[],
        lastTripArrival: string | null,
        totalWaitTimes: { time: string; isTransfer: boolean }[],
        boardings: number[],
      ) {
        if (currentPoint === endPoint) {
          allRoutes.push({
            path: currentPath.slice(),
            price: currentPrice,
            tripIds: currentTripIds.slice(),
            transfers: totalWaitTimes.slice(),
            boardings: boardings.slice(),
          });
          return;
        }

        const currentTimeStamp = convertToTimestamp(currentTime);

        for (const trip of trips) {
          if (trip.origin === currentPoint) {
            const departureTimeStamp = convertToTimestamp(
              trip.departureDateTime,
            );
            if (
              departureTimeStamp >= currentTimeStamp &&
              trip.passangers + passangers <= trip.seats
            ) {
              const newPath = [...currentPath, trip.destination];
              const newPrice = currentPrice + +trip.price;
              const newTripIds = [
                ...currentTripIds,
                {
                  id: trip.id,
                  departureTime: trip.departureDateTime,
                  arrivalTime: trip.arrivalDateTime,
                },
              ];
              const newBoardings = [...boardings, trip.boarding];

              let waitTime = '';
              if (lastTripArrival !== null) {
                const lastTripArrivalStamp =
                  convertToTimestamp(lastTripArrival);
                const waitTimeMillis =
                  departureTimeStamp - lastTripArrivalStamp;
                const days = Math.floor(waitTimeMillis / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                  (waitTimeMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                );
                const minutes = Math.floor(
                  (waitTimeMillis % (1000 * 60 * 60)) / (1000 * 60),
                );
                waitTime = `${days}d ${hours}h ${minutes}m`;

                const isTransfer =
                  (await Trip.findByPk(currentTripIds.at(-1).id)).journey_id !==
                  (await Trip.findByPk(trip.id)).journey_id;

                totalWaitTimes.push({ time: waitTime, isTransfer });
              }

              await dfs(
                trip.destination,
                newPath,
                trip.arrivalDateTime,
                newPrice,
                newTripIds,
                trip.arrivalDateTime,
                [...totalWaitTimes],
                newBoardings,
              );
            }
          }
        }
      }

      // Start the depth-first search
      await dfs(startPoint, [startPoint], startDate, 0, [], null, [], []);

      if (!startPoint || !endPoint) return;

      return allRoutes;
    }

    // getting all avaliable trips
    journey.startPoint = findTripDto.from;
    journey.endPoint = findTripDto.to;
    journey.passangers = findTripDto.passengers;
    if (!findTripDto.return) {
      journey.startPoint = findTripDto.from;
      journey.endPoint = findTripDto.to;
      const routes = await planJourney(journey);
      if (routes.length)
        return {
          status: 'success',
          message: 'all avaliable routes',
          routes,
        };
      else
        return {
          status: 'failed',
          message: 'there is no avaliable routes',
        };
    } else {
      journey.startPoint = findTripDto.to;
      journey.endPoint = findTripDto.from;
      const returning_routes = await planJourney(journey);
      if (returning_routes) {
        journey.startPoint = findTripDto.from;
        journey.endPoint = findTripDto.to;
        const routes = await planJourney(journey);
        if (routes.length)
          return {
            status: 'success',
            message: 'all avaliable routes',
            routes,
          };
        else
          return {
            status: 'failed',
            message: 'there is no avaliable routes',
          };
      } else
        return {
          status: 'failed',
          message: 'there is no avaliable routes',
        };
    }
  }
}
