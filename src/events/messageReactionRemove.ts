import { Bot } from '../Bot'
import { logger } from '@noodlewrecker7/logger'
const log = logger.Logger

export default (bot: Bot) => {
    bot.on('messageReactionRemove', async (messageReaction, user) => {
        const reactions = await bot.DB.getAllRoleReactionsForMessage(messageReaction.message.id)
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
        const roleReaction = await bot.DB.getRoleReactionByEmoji(messageReaction.message.id, emoji)
        if (!roleReaction) {
            // if that emoji doesnt have a set role
            log.debug('Couldnt find role for emoji react remove')
            await messageReaction.users.remove(user.id)
            return
        }
        if (!messageReaction.message.guild) {
            // not in a server
            return
        }
        const member = await messageReaction.message.guild.members.fetch(user.id)

        await member.roles.remove(roleReaction.roleid)
    })
}
