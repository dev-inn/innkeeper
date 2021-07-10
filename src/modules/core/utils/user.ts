import { User } from '../models/User'
import { logger } from '@noodlewrecker7/logger'
const log = logger.Logger
/**Returns the specified user, if no user exists then one is created*/
export async function getUserInServer(userID: string, serverID: string): Promise<User> {
  log.debug('get user in server')
  let user = await User.findOne({ where: { userid: userID, serverid: serverID } })
  if (!user) {
    user = await registerUserInServer(userID, serverID)
  }
  return user
}

/**Registers a new user to the database*/
export async function registerUserInServer(userID: string, serverID: string): Promise<User> {
  return await User.create({ userid: userID, serverid: serverID })
}

/**Selects ten users with the most rep*/
export async function getTopTenUsersByRep(serverID: string): Promise<User[]> {
  return await User.findAll({
    where: { serverid: serverID },
    order: [['reputation', 'DESC']],
    limit: 10
  })
}

export async function setUserCredits(userID: string, serverID: string, amount: number): Promise<void> {
  const user = await getUserInServer(userID, serverID)
  await user.update({ credits: amount })
  await user.save()
}

export async function nukeUserFromServer(userID: string, serverID: string): Promise<number> {
  return await User.destroy({ where: { userid: userID, serverid: serverID }, force: true })
}
