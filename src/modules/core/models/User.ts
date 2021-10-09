import { Model, DataTypes, Sequelize } from 'sequelize'

/** Stores data about a users reputation*/
export class User extends Model {
  public userid?: string
  public serverid?: string
  public reputation!: number
  public credits!: number
  public xp!: number
}
/* eslint-disable require-jsdoc */
export default function (sequelize: Sequelize): void {
  User.init(
    {
      userid: { type: DataTypes.STRING, unique: false, primaryKey: true },
      serverid: { type: DataTypes.STRING, unique: false },
      reputation: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
      credits: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
      xp: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false }
    },
    { tableName: 'users', sequelize: sequelize }
  )
}
