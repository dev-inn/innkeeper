import Discord, { Channel, TextChannel } from 'discord.js'
import { logger } from '@noodlewrecker7/logger'
import { Bot } from '../Bot'
import { getAllMessagesWithRoleReactions } from '../modules/core/utils/rolereactions'

const log = logger.Logger

export default (bot: Bot) => {
  bot.on('ready', async () => {
    log.timeEnd('Started bot in')
    log.info('Bot successfully logged in as: ' + bot.user?.tag)
    await bot.DB.sync()
  })
}
