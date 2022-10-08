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

  /**Tracks the name of the currently loading module for logging purposes*/
  currentlyLoadingModule: string

  /**Initialises client object, sets intents and configs etc*/
  constructor(cfg = 'botcfg.json') {
    log.time('Started bot in')
    super({
      ws: {
        intents: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_MESSAGE_REACTIONS', 'GUILD_VOICE_STATES']
      },
      partials: ['REACTION', 'MESSAGE']
    })
    this.cfg = new ConfigManager(cfg)
    this.DB = new Sequelize('database', 'user', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: this.cfg.get('dbfile') + '.sqlite'
    })
    events(this)
    this.commands = new Discord.Collection()
    this.currentlyLoadingModule = ''
    this.loadModules().then(() => {
      this.DB.sync()
      this.login(this.cfg.get('token')).then(() => {
        this.generateInvite().then((str) => {
          log.info(`Bot started. Invite with ${str}`)
        })
      })
    })
  }

  /**Adds command object*/
  addCommand(cmd: Command): void {
    if (this.commands.has(cmd.name)) {
      log.warn(`${cmd.name} Already exists and will be overwritten. Check for naming conflicts`)
    }
    this.commands.set(cmd.name, cmd)
    log.debug(`Loaded ${this.currentlyLoadingModule}/${cmd.name}`)
  }

  /**Loads each module in the /modules/ folder by running the index.js file*/
  async loadModules(): Promise<void> {
    this.commands.clear()
    // loops through each folder, loads core first just incase anything else depends on it
    const moduleDirs = fs.readdirSync('./out/modules').filter((name) => name != 'core')
    await this.loadModule('core')
    for (let i = 0; i < moduleDirs.length; i++) {
      await this.loadModule(moduleDirs[i])
    }
  }
  /**Loads the specified module
   * @param dir name of the dir in the /modules/ directory to load
   */
  async loadModule(dir: string): Promise<void> {
    this.currentlyLoadingModule = dir
    // gets the index / setup file
    const setupFile = fs
      .readdirSync(`./out/modules/${dir}`)
      .filter((name) => name == 'index.js' || name == 'index.ts')[0]
    if (!setupFile) {
      log.error(`Module ${dir} is missing index.js`)
      return
    }
    const module: (bot: Bot) => void = (await import(`./modules/${dir}/${setupFile}`)).default
    try {
      module(this)
    } catch (e) {
      log.error(`Could not load ${dir}/${setupFile}`)
    }
    log.info(`Module '${dir}' loaded successfully`)
  }
}

new Bot()
