import { logger } from '@noodlewrecker7/logger'
import { Bot } from '../Bot'
import { getServerPrefix } from '../modules/core/utils/server'

const log = logger.Logger

export default (bot: Bot): void => {
  bot.on('message', async (message) => {
    log.debug('Message received')
    let prefix = bot.cfg.get('prefix')
    log.debug(prefix)
    if (message.guild) {
      prefix = (await getServerPrefix(message.guild.id)) || bot.cfg.get('prefix')
    }
    log.debug(prefix)
    if (!message.content.startsWith(prefix) || message.author.bot || message.webhookID) {
      log.debug('Message not bot command')
      return
    }
    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift()?.toLowerCase()
    if (!commandName) return
    const cmd =
      bot.commands.get(commandName) ||
      bot.commands.find((x) => {
        return x.aliases && x.aliases.includes(commandName)
      })
    cmd?.invoke(message, bot, args)
  })
}
