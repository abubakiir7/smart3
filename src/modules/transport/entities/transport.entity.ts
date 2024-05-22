import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Seats } from './seats.entity';

interface ITransportCreationAttr {
  raw: number;
  column: number;
}

@Table({ tableName: 'transport' })
export class Transport extends Model<Transport, ITransportCreationAttr> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.INTEGER })
  raw: number;

  @Column({ type: DataType.INTEGER })
  column: number;

  @Column({ type: DataType.INTEGER })
  seats: number;

  @HasMany(() => Seats)
  transportSeats: Seats[];
}

