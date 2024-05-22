import {
    BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Transport } from '../../transport/entities/transport.entity';
import { Trip } from '../../trip/entities/trip.entity';

class IJourneyCreationAttr {
  origin: string;
  destination: string;
  beginning_time: Date;
  ending_time: Date;
  price: number;
}

@Table({ tableName: 'journey' })
export class Journey extends Model<Journey, IJourneyCreationAttr> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING(255) })
  origin: string;

  @Column({ type: DataType.STRING(255) })
  destination: string;

  @Column({ type: DataType.DATE })
  beginning_time: Date;

  @Column({ type: DataType.DATE })
  ending_time: Date;

  @ForeignKey(() => Transport)
  @Column({ type: DataType.INTEGER })
  transport_id: number;

  // @Column({type: DataType.GEOGRAPHY('POINT')})
  // coordinates: any

  @BelongsTo(() => Transport)
  transport: Transport
}
