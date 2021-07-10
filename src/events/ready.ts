import Discord, { Channel, TextChannel } from 'discord.js'
import { logger } from '@noodlewrecker7/logger'
import { Bot } from '../Bot'
import { getAllMessagesWithRoleReactions } from '../modules/core/utils'

const log = logger.Logger

export default (bot: Bot) => {
  bot.on('ready', async () => {
    log.timeEnd('Started bot in')
    log.info('Bot successfully logged in as: ' + bot.user?.tag)
    await bot.DB.sync()

    // caches all messages with role reacts
    const reacts = await getAllMessagesWithRoleReactions()
    for (let i = 0; i < reacts.length; i++) {
      const r = reacts[i]
      const guild = await bot.guilds.fetch(r.serverid)
      if (!guild.afkChannel) continue
      const channel = guild.channels.cache.get(r.channelid)
      if (!channel) continue
      const channelTyped = <TextChannel>channel
      await channelTyped.messages.fetch(r.messageid)
    }
  })
}
