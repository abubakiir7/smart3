import { UUID } from 'crypto';

export class CreateTicketDto {
  user_id: number
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  trip_ids: number[];
  seat_ids: number[];
  ticket_unique_id?: string
}
