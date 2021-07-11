import { Bot } from '../../../Bot'
import { logger } from '@noodlewrecker7/logger'
import { getAllRoleReactionsForMessage, getRoleReactionByEmoji } from '../utils/rolereactions'
const log = logger.Logger

export default (bot: Bot): void => {
  bot.on('messageReactionAdd', async (messageReaction, user) => {
    // todo properly test this
    if (user.bot) {
      // assume if origin is bot then its good
      return
    }
    const reactions = await getAllRoleReactionsForMessage(messageReaction.message.id)
    if (reactions.length <= 0) {
      return
    }

    let emoji = messageReaction.message.guild?.emojis.resolveIdentifier(messageReaction.emoji)
    if (!emoji) {
      return
    }
    let roleReaction = await getRoleReactionByEmoji(messageReaction.message.id, emoji)
    if (!roleReaction) {
      emoji = emoji.replace(':', '%3A')
      roleReaction = await getRoleReactionByEmoji(messageReaction.message.id, emoji)
    }
    if (!roleReaction) {
      log.debug('No role reaction found')
      log.debug(`emoji: ${emoji}`)
      await messageReaction.remove()
      return
    }
    if (!messageReaction.message.guild) {
      return
    }
    const member = await messageReaction.message.guild.members.fetch(user.id)

    await member.roles.add(roleReaction.roleid)
  })
}
