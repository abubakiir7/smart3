import { Column, DataType, Model, Table, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

interface IOtpCreationAttr {
  uuid: string;
  otp: number;
  expiration_time: Date;
  phone: string;
}

@Table({ tableName: 'otp' })
export class Otp extends Model<Otp, IOtpCreationAttr> {
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  uuid: string;

  @Column({ type: DataType.INTEGER })
  otp: number;

  @Column({ type: DataType.DATE })
  expiration_time: Date;

  @Column({ type: DataType.STRING })
  phone: string;
}
