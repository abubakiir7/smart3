import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Journey } from '../../journey/entities/journey.entity';

interface ITripCreationAttr {
  from: string;
  to: string;
  beginning_time: Date;
  ending_time: Date;
  journey_id: number;
  passangers: number;
  seats: number[];
  price: number;
  boarding: number;
  coment: string;
}

@Table({ tableName: 'trips' })
export class Trip extends Model<Trip, ITripCreationAttr> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING(50) })
  from: string;

  @Column({ type: DataType.STRING(50) })
  to: string;

  @Column({ type: DataType.DATE })
  beginning_time: Date;

  @Column({ type: DataType.DATE })
  ending_time: Date;

  @ForeignKey(() => Journey)
  @Column({ type: DataType.INTEGER })
  journey_id: number;

  @Column({ type: DataType.INTEGER })
  passangers: number;

  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  seats: number[];

  @Column({ type: DataType.DECIMAL })
  price: number;

  @Column({ type: DataType.INTEGER })
  boarding: number;

  @Column({ type: DataType.TEXT })
  coment: string;

  @BelongsTo(() => Journey)
  journey: Journey;
}
