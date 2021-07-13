import Command from '../../../Command'
import 'fs'

import { getVideoObjFromYTVideoArg } from '../utils/youtube'
import { QueueItem } from '../models/QueueItem'
import { MessageEmbed } from 'discord.js'
import { User } from '../../core/models/User'
/**Amount of queue items to retrieve per page. MAX - 25*/
const PAGE_SIZE = 20
const cmd = new Command('listqueue', [{ name: 'page', optional: true }], async (message, bot, args) => {
  const embed = new MessageEmbed()
  let page = parseInt(args.page)
  if (!page || page < 0) {
    page = 1
  }

  const queue = await QueueItem.findAll({
    where: { serverId: message.guild?.id },
    order: [['createdAt', 'ASC']],
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE
  })
  for (let i = 0; i < queue.length; i++) {
    const qi = queue[i]
    embed.addField('#' + (i + 1), `\`${qi.title} - ${qi.author}\``)
  }
  message.channel.send(embed)
})
cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = '~~Lists all songs in queue~~ Not functioning'
cmd.rejectExtraArgs = false
export default cmd
