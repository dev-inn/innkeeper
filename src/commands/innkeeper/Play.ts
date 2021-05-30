import Command from '../../Command'
import 'fs'
import * as fs from 'fs'

import { logger } from '@noodlewrecker7/logger'
import ytdl from 'ytdl-core-discord'
import ytsr, { Item, Video } from 'ytsr'

const log = logger.Logger

const insaneRegexString = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

const cmd = new Command(
    'play',
    [{ name: 'video', optional: false, catchRest: true }],
    async (message, bot, args) => {
        let url

        // tests if input was a url
        const regMatch = args.video.match(insaneRegexString)
        if (regMatch) {
            url = regMatch[0]
        } else {
            // otherwise it searches for a video by that name and gives first result
            const results = await ytsr(args.video, { limit: 1 })
            const item = <Video>results.items[0]
            url = item.url
        }
        log.debug(`Playing ${url}`)
        await message.channel.send(`Playing video:\n${url}`)
        if (message.member?.voice?.channel) {
            const connection = await message.member.voice.channel.join()
            const dispatcher = connection.play(await ytdl(url), {
                type: 'opus'
            })
            connection.on('disconnect', () => {
                dispatcher.destroy()
            })
        } else {
            await message.reply('You are not in a voice channel')
        }
    }
)
cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = 'Plays a video'

export default cmd
