import Command from '../../Command'
import 'fs'
import * as fs from 'fs'

import { logger } from '@noodlewrecker7/logger'
import ytdl from 'ytdl-core-discord'
import ytsr, { Item, Video } from 'ytsr'

const log = logger.Logger

const insaneRegexString = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

const cmd = new Command(
    'queue',
    [{ name: 'video', optional: false, catchRest: true }],
    async (message, bot, args) => {
        // todo queue up songs and such
        // todo probably make separate helper class for methods like getting and parsing video
    }
)
cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = 'Adds song to queue'
cmd.rejectExtraArgs = false
export default cmd
