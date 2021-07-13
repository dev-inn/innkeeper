import {
  Model,
  DataTypes,
  Sequelize,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize'
import { StringMappingType } from 'typescript'
import { Server } from '../../core/models/Server'
import { User } from '../../core/models/User'

/** Stores data about a users reputation*/
export class QueueItem extends Model {
  public url!: string
  getUser!: BelongsToGetAssociationMixin<User>
  setUser!: BelongsToSetAssociationMixin<User, string>

  getServer!: BelongsToGetAssociationMixin<Server>
  setServer!: BelongsToSetAssociationMixin<Server, string>

  public title?: string
  public author?: string
}
/* eslint-disable require-jsdoc */
export default function (sequelize: Sequelize): void {
  QueueItem.init(
    {
      url: { type: DataTypes.STRING, unique: false, allowNull: false },
      title: { type: DataTypes.STRING, unique: false, allowNull: false },
      author: { type: DataTypes.STRING, unique: false, allowNull: true }
    },
    { tableName: 'musicqueue', sequelize: sequelize }
  )
  QueueItem.belongsTo(User)
  User.hasMany(QueueItem)
  QueueItem.belongsTo(Server)
  Server.hasMany(QueueItem)
}
