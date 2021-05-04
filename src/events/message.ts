import Discord from 'discord.js'
import { logger } from '@noodlewrecker7/logger'
import { Bot } from '../Bot'
import Command from '../Command'

const log = logger.Logger

export default (bot: Bot) => {
    bot.on('message', async (message) => {
        log.debug('Message received')
        let prefix
        if (message.guild) {
            prefix = (await bot.DB.getServerPrefix(message.guild.id)) || bot.cfg.get('prefix')
        } else {
            prefix = bot.cfg.get('prefix')
        }
        if (!message.content.startsWith(prefix) || message.author.bot) {
            log.debug('Message not bot command')
            return
        }
        const commandName = message.content.slice(prefix.length).split(/ +/)[0]
        const cmd =
            bot.commands.get(commandName) ||
            bot.commands.find((x) => {
                return x.aliases && x.aliases.includes(commandName)
            })
        cmd?.invoke(message, bot)
    })
}
