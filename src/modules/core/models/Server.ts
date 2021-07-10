import { Model, Sequelize, DataTypes } from 'sequelize'
/**
 * Stores data about the servers*/
export class Server extends Model {
  serverid!: string
  prefix!: string
  bot_admin_role?: string
}

/* eslint-disable require-jsdoc */
export default function (sequelize: Sequelize): void {
  Server.init(
    {
      serverid: { type: DataTypes.STRING, unique: true, allowNull: false },
      prefix: { type: DataTypes.CHAR, allowNull: true },
      bot_admin_role: { type: DataTypes.STRING, allowNull: true }
    },
    { tableName: 'servers', sequelize: sequelize }
  )
}
