import rrinit from './RoleReaction'
import sinit from './Server'
import rinit from './Rank'
import uinit from './User'
import { Sequelize } from 'sequelize'

export default (seq: Sequelize): void => {
  rrinit(seq)
  sinit(seq)
  rinit(seq)
  uinit(seq)
}
