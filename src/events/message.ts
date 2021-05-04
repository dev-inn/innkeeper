import Discord from 'discord.js'
import { logger } from '@noodlewrecker7/logger'
import { Bot } from '../Bot'

const log = logger.Logger

export default (client: Bot) => {
    client.on('message', (message) => {
        if (
            message.content.startsWith(client.cfg.get('prefix')) ||
            message.author.bot
        ) {
            return
        }
    })
}
