import { Model, DataTypes, Sequelize } from 'sequelize'

/**Holds ties between a role and an emoji reaction to a message*/
export class RoleReaction extends Model {
  public serverid!: string
  public roleid!: string
  public messageid!: string
  public emoji!: string
  public channelid!: string
}
/* eslint-disable require-jsdoc */
export default function (sequelize: Sequelize): void {
  RoleReaction.init(
    {
      serverid: { type: DataTypes.STRING, unique: false, allowNull: false },
      roleid: { type: DataTypes.STRING, allowNull: false },
      messageid: { type: DataTypes.STRING, allowNull: false },
      emoji: { type: DataTypes.STRING, allowNull: false },
      channelid: { type: DataTypes.STRING, allowNull: false }
    },
    { tableName: 'rolereactions', sequelize: sequelize }
  )
}
