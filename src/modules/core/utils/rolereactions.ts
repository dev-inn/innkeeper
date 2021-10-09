import { RoleReaction } from '../models/RoleReaction'
import { logger } from '@noodlewrecker7/logger'
const log = logger.Logger

/**Creates a tie between a messageid, roleid, and the reaction emoji
 * @param serverid - Discord snowflake of the server its in
 * @param messageid - Discord snowflake of the message
 * @param roleid - Discord snowflake of the role
 * @param emoji - emoji name string
 * @param channelid - Discord snowflake of the channel its in
 */
export async function insertRoleReaction(
  serverid: string,
  messageid: string,
  roleid: string,
  emoji: string,
  channelid: string
): Promise<RoleReaction> {
  log.debug('Inserting rolereaction')
  log.debug(JSON.stringify({ serverid, messageid, roleid, emoji, channelid }))
  return RoleReaction.create({ serverid, messageid, roleid, emoji, channelid })
}

/**Returns all rolereaction ties for a given messageid*/
export async function getAllRoleReactionsForMessage(messageid: string): Promise<RoleReaction[]> {
  return RoleReaction.findAll({ where: { messageid } })
}

/**Finds a specific rolereactoin record by the emoji on the message */
export async function getRoleReactionByEmoji(messageid: string, emoji: string): Promise<RoleReaction | null> {
  return await RoleReaction.findOne({ where: { messageid, emoji } })
}

/**Removes the role reaction connection on the specified emoji*/
export async function removeRoleReactionByEmoji(messageid: string, emoji: string): Promise<number> {
  return await RoleReaction.destroy({ where: { messageid, emoji } })
}

/**Selects all rolereaction ties*/
export async function getAllRoleReactions(): Promise<RoleReaction[]> {
  return await RoleReaction.findAll()
}
