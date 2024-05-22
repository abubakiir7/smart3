import { CreateTripDto } from '../../trip/dto/create-trip.dto';

export class CreateJourneyDto {
  transport_id: number;
  trips: CreateTripDto[];
}
