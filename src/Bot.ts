import 'source-map-support/register'
import Discord from 'discord.js'
import { logger } from '@noodlewrecker7/logger'
import Logger = logger.Logger
import { ConfigManager } from './ConfigManager'
import events from './events'
import * as fs from 'fs'
import Command from './Command'

const log = logger.Logger
log.setLevel(Logger.Levels.TRACE)

/** Class containing everything for the bot*/
export class Bot extends Discord.Client {
    cfg: ConfigManager
    private commands: Discord.Collection<string, Command>

    constructor() {
        log.time('Started bot in')
        super()
        this.cfg = new ConfigManager('botcfg.json')
        events(this)
        this.login(this.cfg.get('token'))
        this.commands = new Discord.Collection()
        this.loadCommands()
    }

    async loadCommands() {
        this.commands.clear()
        const commandFiles = fs
            .readdirSync('./out/commands')
            .filter((name) => name.endsWith('.js'))

        for (let i = 0; i < commandFiles.length; i++) {
            const file = commandFiles[i]
            const cmd: Command = await import(`./commands/${file}`)
            this.commands.set(cmd.name, cmd)
            log.debug(`Loaded ${cmd.aliases}`)
            console.log(cmd)
        }
    }
}

const BOT = new Bot()
