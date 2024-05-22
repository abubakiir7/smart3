import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Seats } from '../../transport/entities/seats.entity';

interface ITicketCreationAttr {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  trip_ids: number[];
  seat_id: number[];
  ticket_unique_id: string;
  is_active: boolean;
}

@Table({ tableName: 'tickets' })
export class Ticket extends Model<Ticket, ITicketCreationAttr> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING(50) })
  first_name: string;

  @Column({ type: DataType.STRING(50) })
  last_name: string;

  @Column({ type: DataType.STRING(15) })
  phone: string;

  @Column({ type: DataType.STRING(50) })
  email: string;

  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  trip_ids: number[];

  @ForeignKey(() => Seats)
  @Column({ type: DataType.ARRAY(DataType.ARRAY(DataType.INTEGER)) })
  seat_ids: [number[]];

  @Column({ type: DataType.UUID })
  ticket_unique_id: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;
}