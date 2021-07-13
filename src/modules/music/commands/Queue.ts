import Command from '../../../Command'
import 'fs'

import { getVideoObjFromYTVideoArg } from '../utils/youtube'
import { QueueItem } from '../models/QueueItem'

const cmd = new Command('queue', [{ name: 'video', optional: false }], async (message, bot, args) => {
  const video = await getVideoObjFromYTVideoArg(args.video).catch(async (err) => {
    await message.reply(err)
  })
  if (!video) {
    return
  }
  const qitem = await QueueItem.create({ url: video.url, title: video.title, author: video.author })
  qitem.setUser(message.author.id)
  qitem.setServer(message.guild?.id)
  qitem.save()
})
cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = '~~Adds song to queue~~ Not functioning'
cmd.rejectExtraArgs = false
export default cmd
