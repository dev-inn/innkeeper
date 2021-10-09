import { logger } from '@noodlewrecker7/logger'
import { Bot } from '../Bot'

const log = logger.Logger

export default (bot: Bot): void => {
  bot.on('ready', async () => {
    log.timeEnd('Started bot in')
    log.info('Bot successfully logged in as: ' + bot.user?.tag)
    await bot.DB.sync()
  })
}
