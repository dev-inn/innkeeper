import 'source-map-support/register'
import Discord from 'discord.js'
import { logger } from '@noodlewrecker7/logger'
import Logger = logger.Logger
import { ConfigManager } from './ConfigManager'
import events from './events'
import * as fs from 'fs'
import Command from './Command'
import Database from './Database'
import path from 'path'

const log = logger.Logger
log.setLevel(Logger.Levels.TRACE)

/** Class containing everything for the bot*/
export class Bot extends Discord.Client {
    cfg: ConfigManager
    commands: Discord.Collection<string, Command>
    DB: Database

    /**Initialises client object, sets intents and configs etc*/
    constructor() {
        log.time('Started bot in')
        super({
            ws: {
                intents: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_MESSAGE_REACTIONS']
            },
            partials: ['REACTION', 'MESSAGE']
        })
        this.cfg = new ConfigManager('botcfg.json')
        events(this)
        this.login(this.cfg.get('token'))
        this.commands = new Discord.Collection()
        this.loadCommands()
        this.DB = new Database()
    }

    /**Loops through all directories in the commands folder, then loops through each file and loads it. Does not recurse through folders only one layer deep*/
    async loadCommands(): Promise<void> {
        this.commands.clear()
        // loops through each folder
        const commandDirs = fs.readdirSync('./out/commands')
        for (let i = 0; i < commandDirs.length; i++) {
            const commandFiles = fs
                .readdirSync(`./out/commands/${commandDirs[i]}`)
                .filter((name) => name.endsWith('.js'))
            //get all the js files in the folder
            // loops through each file
            for (let j = 0; j < commandFiles.length; j++) {
                const file = commandFiles[j]
                // imports the file
                const cmd: any = (await import(`./commands/${commandDirs[i]}/${file}`)).default
                // if a Command object is exported
                if (cmd instanceof Command) {
                    // loads the command to the collection
                    this.commands.set(cmd.name, cmd)
                    log.debug(`Loaded ${commandDirs[i]}/${cmd.name}`)
                } else {
                    // assumes its a setup file and calls it as function, passing and isntance of Bot
                    try {
                        cmd(this)
                    } catch (e) {
                        log.error(`Could not load ${commandDirs[i]}/${file}`)
                    }
                }
            }
        }
    }
}

const BOT = new Bot()
