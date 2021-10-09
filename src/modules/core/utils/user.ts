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

/**Sets a users credits to exact amount
 * @param userID the user to alter
 * @param serverID the server in which to change their credit count
 * @param amount the new amount of credits to have
 */
export async function setUserCredits(userID: string, serverID: string, amount: number): Promise<void> {
  const user = await getUserInServer(userID, serverID)
  await user.update({ credits: amount })
  await user.save()
}

/**Wipes the user from the database within that specific server
 * @param userID ID of the user to delete
 * @param serverID the server from within which to delete the user
 * @returns number of user objects destroyed
 */
export async function nukeUserFromServer(userID: string, serverID: string): Promise<number> {
  return await User.destroy({ where: { userid: userID, serverid: serverID }, force: true })
}
