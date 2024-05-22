class Passangers {
  trip_ids: [any];
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  passangers: number;
}

export class BookingJourneyDto {
  user_id: number;
  passangers: Passangers[];
}
