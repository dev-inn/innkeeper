import 'source-map-support/register'
import Discord from 'discord.js'
import { logger } from '@noodlewrecker7/logger'
import Logger = logger.Logger
import { ConfigManager } from './ConfigManager'
import events from './events'
import * as fs from 'fs'
import Command from './Command'
import { Sequelize } from 'sequelize'

const log = logger.Logger
log.setLevel(Logger.Levels.TRACE)

/** Class containing everything for the bot*/
export class Bot extends Discord.Client {
  cfg: ConfigManager
  commands: Discord.Collection<string, Command>
  DB: Sequelize

  /**Initialises client object, sets intents and configs etc*/
  constructor() {
    log.time('Started bot in')
    super({
      ws: {
        intents: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_MESSAGE_REACTIONS', 'GUILD_VOICE_STATES']
      },
      partials: ['REACTION', 'MESSAGE']
    })
    this.cfg = new ConfigManager('botcfg.json')
    events(this)
    this.login(this.cfg.get('token'))
    this.commands = new Discord.Collection()
    this.loadModules()
    this.DB = new Sequelize('database', 'user', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: 'database.sqlite'
    })
    this.DB.sync()
  }

  /**Adds command object*/
  addCommand(cmd: Command): void {
    if (this.commands.has(cmd.name)) {
      log.warn(`${cmd.name} Already exists and will be overwritten. Check for naming conflicts`)
    }
    this.commands.set(cmd.name, cmd)
    log.debug(`Loaded ${cmd.name}`)
  }

  /**Loops through all directories in the commands folder, then loops through each file and loads it. Does not recurse through folders only one layer deep*/
  async loadModules(): Promise<void> {
    this.commands.clear()
    // loops through each folder
    const moduleDirs = fs.readdirSync('./out/modules')
    for (let i = 0; i < moduleDirs.length; i++) {
      // gets the index / setup file
      const setupFile = fs.readdirSync(`./out/modules/${moduleDirs[i]}`).filter((name) => name == 'index.js')
      const cmd: (bot: Bot) => void = (await import(`./modules/${moduleDirs[i]}/${setupFile}`)).default
      try {
        cmd(this)
      } catch (e) {
        log.error(`Could not load ${moduleDirs[i]}/${setupFile}`)
      }
      // }
    }
  }
}

const BOT = new Bot()
BOT.generateInvite().then((str) => {
  log.info(`Bot started. Invite with ${str}`)
})
