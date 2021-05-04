import Discord from 'discord.js'
import { logger } from '@noodlewrecker7/logger'
import { Bot } from '../Bot'

const log = logger.Logger

export default (bot: Bot) => {
    bot.on('ready', () => {
        log.timeEnd('Started bot in')
        log.info('Bot successfully logged in as: ' + bot.user?.tag)
        bot.DB.sync()
    })
}
