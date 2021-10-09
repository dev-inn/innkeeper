import { TextChannel } from 'discord.js'
import { Bot } from '../../../Bot'
import { getAllRoleReactions } from '../utils/rolereactions'

export default (bot: Bot): void => {
  bot.on('ready', async () => {
    // caches all messages with role reacts
    const reacts = await getAllRoleReactions()
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
