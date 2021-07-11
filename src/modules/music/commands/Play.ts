import Command from '../../../Command'
import 'fs'

import { logger } from '@noodlewrecker7/logger'
import ytdl from 'ytdl-core-discord'
import { getYoutubeUrlFromVideoArg } from '../utils/youtube'
import { QueueItem } from '../models/QueueItem'
import { VoiceConnection } from 'discord.js'

const log = logger.Logger

/**Called when the dispatcher finishes playing, plays the next song in the queue if one exists*/
async function onDispatcherFinish(connection: VoiceConnection) {
  // get next url
  const qitem = await QueueItem.findOne({
    where: { serverId: connection.channel.guild.id },
    order: [['createdAt', 'ASC']]
  })
  if (!qitem) {
    connection.disconnect()
    return
  }

  const dispatcher = connection.play(await ytdl(qitem.url), {
    type: 'opus'
  })
  qitem.destroy()
  dispatcher.on('finish', async () => {
    onDispatcherFinish(connection)
  })
}

const cmd = new Command(
  'play',
  [{ name: 'video', optional: false, catchRest: true }],
  async (message, bot, args) => {
    const url = await getYoutubeUrlFromVideoArg(args.video).catch(async (err) => {
      await message.reply(err)
    })
    if (!url) {
      return
    }

    log.debug(`Playing ${url}`)
    if (message.member?.voice?.channel) {
      const connection = await message.member.voice.channel.join()
      // automatically destroys the old dispatcher if exists
      const dispatcher = connection.play(await ytdl(url), {
        type: 'opus'
      })
      await message.channel.send(`Playing video:\n${url}`)
      dispatcher.on('finish', async () => {
        onDispatcherFinish(connection)
      })

      connection.on('disconnect', () => {
        connection.dispatcher.destroy()
      })
    } else {
      await message.reply('You are not in a voice channel')
    }
  }
)
cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = 'Plays a video'
cmd.rejectExtraArgs = false
export default cmd
