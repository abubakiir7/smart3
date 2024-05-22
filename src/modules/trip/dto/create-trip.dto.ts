export class CreateTripDto {
  from: string;
  to: string;
  beginning_time: Date;
  ending_time: Date;
  journey_id: number;
  passangers: number;
  price: number;
  coment: string;
}
