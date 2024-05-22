import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Transport } from "./transport.entity";

interface ISeatsCretionAttr {
    transport_id: number
}

@Table({tableName: 'seats'}) 
export class Seats extends Model<Seats, ISeatsCretionAttr> {
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id: number

    @ForeignKey(() => Transport)
    @Column({type: DataType.INTEGER})
    transport_id: number
}