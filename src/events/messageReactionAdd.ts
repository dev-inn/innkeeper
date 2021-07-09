import { Bot } from '../Bot'
import { logger } from '@noodlewrecker7/logger'
const log = logger.Logger

export default (bot: Bot) => {
    bot.on('messageReactionAdd', async (messageReaction, user) => {
        // todo properly test this
        if (user.bot) {
            // assume if origin is bot then its good
            return
        }
        const reactions = await bot.DB.getAllRoleReactionsForMessage(messageReaction.message.id)
        if (reactions.length <= 0) {
            return
        }
        const emoji = messageReaction.emoji
        if (!emoji) {
            return
        }
        const roleReaction = await bot.DB.getRoleReactionByEmoji(
            messageReaction.message.id,
            messageReaction.emoji.identifier
        )
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
