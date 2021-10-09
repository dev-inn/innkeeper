import { Bot } from '../../../Bot'
import { logger } from '@noodlewrecker7/logger'
import { getAllRoleReactionsForMessage, getRoleReactionByEmoji } from '../utils/rolereactions'
const log = logger.Logger

export default (bot: Bot): void => {
  bot.on('messageReactionRemove', async (messageReaction, user) => {
    log.debug('message react removed')
    const reactions = await getAllRoleReactionsForMessage(messageReaction.message.id)
    if (reactions.length <= 0) {
      // if there are no reactions set for that message, do nothing
      log.debug('didnt find any reactions')
      return
    }
    const emoji = bot.emojis.resolveIdentifier(messageReaction.emoji) // get the emoji
    if (!emoji) {
      // emoji invalid somehow
      log.debug('emoji invalid on remove reaction')
      return
    }
    const roleReaction = await getRoleReactionByEmoji(messageReaction.message.id, emoji)
    if (!roleReaction) {
      log.debug('could not find the role')
      return
    }
    if (!messageReaction.message.guild) {
      // not in a server
      log.debug('not in server')
      return
    }
    const member = await messageReaction.message.guild.members.fetch(user.id)

    await member.roles.remove(roleReaction.roleid)
  })
}
