import Command from '../../../Command'
import 'fs'
import * as fs from 'fs'

import { logger } from '@noodlewrecker7/logger'
import ytdl from 'ytdl-core-discord'
import ytsr, { Item, Video } from 'ytsr'
import { getYoutubeUrlFromVideoArg } from '../utils/youtube'
import { QueueItem } from '../models/QueueItem'

const log = logger.Logger

const insaneRegexString =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

const cmd = new Command(
  'queue',
  [{ name: 'video', optional: false, catchRest: true }],
  async (message, bot, args) => {
    // todo queue up songs and such
    // todo probably make separate helper class for methods like getting and parsing video
    const url = await getYoutubeUrlFromVideoArg(args.video).catch(async (err) => {
      await message.reply(err)
    })
    if (!url) {
      return
    }
    const qitem = await QueueItem.create({ url })
    qitem.setUser(message.author.id)
    qitem.setServer(message.guild?.id)
    qitem.save()
  }
)
cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = '~~Adds song to queue~~ Not functioning'
cmd.rejectExtraArgs = false
export default cmd
