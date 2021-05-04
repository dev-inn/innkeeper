import Discord from 'discord.js'
import { logger } from '@noodlewrecker7/logger'

const log = logger.Logger

export default (client: Discord.Client) => {
    client.on('ready', () => {
        log.timeEnd('Started bot in')
        log.info('Bot successfully logged in as: ' + client.user?.tag)
        return
    })
}
