import 'source-map-support/register'
import Discord from 'discord.js'
import { logger } from '@noodlewrecker7/logger'
import Logger = logger.Logger
import { ConfigManager } from './ConfigManager'

const log = logger.Logger
log.setLevel(Logger.Levels.TRACE)

const client: Discord.Client = new Discord.Client()
const cfg = new ConfigManager('botcfg.json')

client.on('ready', () => {
    log.info('Ready')
})
client.on('message', () => {
    return
})

client.login(cfg.get('token'))
