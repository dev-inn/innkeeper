import { Model, Sequelize, DataTypes } from 'sequelize'
/**
 * Ranks for reputation by [p]award*/
export class Rank extends Model {
  public serverid!: string
  public entry_rep!: number
  public budget!: number
  public roleid?: string
}
/* eslint-disable require-jsdoc */

export default function (sequelize: Sequelize): void {
  Rank.init(
    {
      serverid: { type: DataTypes.STRING, unique: false },
      entry_rep: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      budget: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      roleid: { type: DataTypes.STRING, allowNull: true }
    },
    { tableName: 'ranks', sequelize: sequelize }
  )
}
