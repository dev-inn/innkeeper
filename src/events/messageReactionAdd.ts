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

        let emoji = messageReaction.message.guild?.emojis.resolveIdentifier(messageReaction.emoji)
        if (!emoji) {
            return
        }
        let roleReaction = await bot.DB.getRoleReactionByEmoji(messageReaction.message.id, emoji)
        if (!roleReaction) {
            emoji = emoji.replace(':', '%3A')
            roleReaction = await bot.DB.getRoleReactionByEmoji(messageReaction.message.id, emoji)
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
