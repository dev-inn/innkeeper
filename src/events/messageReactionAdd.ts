import { Bot } from '../Bot'
import { logger } from '@noodlewrecker7/logger'
const log = logger.Logger

export default (bot: Bot) => {
    bot.on('messageReactionAdd', async (messageReaction, user) => {
        const reactions = await bot.DB.getAllRoleReactionsForMessage(messageReaction.message.id)
        if (reactions.length <= 0) {
            return
        }
        const emoji = bot.emojis.resolveIdentifier(messageReaction.emoji)
        if (!emoji) {
            return
        }
        const roleReaction = await bot.DB.getRoleReactionByEmoji(messageReaction.message.id, emoji)
        if (!roleReaction) {
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
