import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IUserModelCreationAttr {
  id: number;
  phone: string;
}

@Table({ tableName: 'user' })
export class User extends Model<IUserModelCreationAttr, User> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING(50), allowNull: true })
  phone: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  firstName: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  lastName: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  email: string;

  @Column({ type: DataType.ENUM('erkak', 'ayol'), allowNull: true })
  gender: 'erkak' | 'ayol';
}
