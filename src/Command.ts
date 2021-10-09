import Discord from 'discord.js'
import { Bot } from './Bot'
import { logger } from '@noodlewrecker7/logger'
import { getServer } from './modules/core/utils/server'

const log = logger.Logger

type argDefinitions = {
  name: string
  optional: boolean
  mention?: string
  /**Wether the rest of the input will be collected in this one arg*/
  catchRest?: boolean
}[]
/**Contains all required data for handling command execution*/
export default class {
  /**List of argument names*/
  argDefs: argDefinitions
  private readonly func: (
    message: Discord.Message,
    bot: Bot,
    args: { [key: string]: string }
  ) => Promise<void>
  /**Cooldown time between commands in ms
   * @default 5000
   */
  cooldown = 5000 // time in milliseconds of command usage cooldown per user
  /**Whether command can only be used in servers
   * @default true
   */
  guildOnly = true
  /**Other single-word strings that should trigger this command*/
  aliases: string[] = []
  /**List of permissions bit flags that are required to use this command*/
  requiredPermissions: number[] = []
  /**Name of the command, can be used to call the command*/
  name: string // command name
  private cooldownTimers = new Discord.Collection<string, number>() // userid:timestamp
  /**Displayed by the help command to describe the command function*/
  description = ''

  /**Whether or not the command is invalid if too many args are passed
   * Automatically false if a catchRest arg is supplied*/
  rejectExtraArgs = true

  /**Adds a new alias
   * @param name the string to alias with the command*/
  alias(name: string): void {
    this.aliases.push(name)
  }

  /**
   * @param name The call name and display name of the command
   * @param args and argDefinitions object containing the layout of arguments
   * @param func invoked when the command is successfully called with adequate arguments
   */
  constructor(
    name: string,
    args: argDefinitions,
    func: (message: Discord.Message, bot: Bot, args: { [key: string]: string }) => Promise<void>
  ) {
    this.func = func
    this.argDefs = args
    this.name = name.toLowerCase()

    // Validation of arg defs
    let optionalPrecedent = false
    for (let i = 0; i < args.length; i++) {
      if (optionalPrecedent && !args[i].optional) {
        log.warn(
          `Command Definition Error: <${name}> Cannot have optional argument followed by non-optional argument`
        )
      }
      if (args[i].catchRest) {
        this.rejectExtraArgs = false
        if (i != args.length - 1) {
          log.warn(
            `Command Definition Error: <${name}> Cannot have an argument with catchRest followed by other argument`
          )
        }
      }

      if (args[i].optional) {
        optionalPrecedent = true
      }
    }
  }

  /**Returns a string to displayed to use explaining usage of command*/
  usageString(prefix: string): string {
    let argsString = ''
    for (let i = 0; i < this.argDefs.length; i++) {
      const arg = this.argDefs[i]
      argsString += ` <${arg.optional ? '?' : ''}${arg.mention ? '@' : ''}${arg.name}>`
    }
    return prefix + this.name + argsString
  }

  /**
   * Invokes the command's function performs a variety of checks on the incoming data to make sure everything runs smoothly
   * @param message the message object provided by discord
   * @param bot instance of Bot class
   * @param args list of strings that are passes as arguments*/
  async invoke(message: Discord.Message, bot: Bot, args: string[]): Promise<void> {
    // im really sorry this function is a bit of a mess but it shouldn't ever really need to be touched

    // check if can be run in this context
    if (this.guildOnly && !message.guild) {
      return
    }
    // check permissions
    if (this.requiredPermissions) {
      // if command needs perms
      if (!message.guild) {
        // if it needs perms then it musts be in a server
        return
      }
      const adminRole = <string>(await getServer(message.guild.id)).bot_admin_role

      if (!message.member?.hasPermission('ADMINISTRATOR') && !message.member?.roles.cache.has(adminRole)) {
        // bypassed if they have admin privileges
        for (let i = 0; i < this.requiredPermissions.length; i++) {
          // for each required perm
          if (
            !message.member?.hasPermission(this.requiredPermissions[i]) // user doesnt have perm
          ) {
            await message.reply('You need permission to use that command')
            return
          }
        }
      }
    }

    if (args.length > this.argDefs.length && this.rejectExtraArgs) {
      await message.channel.send('Too many arguments')
      return
    }
    // args to be passed to fund
    const argObj: { [key: string]: string } = {}

    /**Args obj creation*/
    // loops all the expected args
    for (let i = 0; i < this.argDefs.length; i++) {
      if (this.argDefs[i].catchRest) {
        argObj[this.argDefs[i].name] = args.slice(i).join().replace(/,/g, ' ')
        continue
      }

      // if there is nothing supplied and its not optional
      if (!args[i] && !this.argDefs[i].optional) {
        await message.channel.send(`Missing ${this.argDefs[i].name} parameter`)
        return
      }
      // if its not there but its optional
      if (this.argDefs[i].optional && !args[i]) {
        // break not continue because there should be no further args after the first optional is omitted
        break
      }
      let content
      if (this.argDefs[i].mention == 'user') {
        // /^<@!?(\d+)>$/
        const regex = args[i].match(/^<@!?(\d+)>$/)
        if (regex) {
          content = regex[0]
        }
      } else if (this.argDefs[i].mention == 'role') {
        // /^<@&(\d+)>$/
        const regex = args[i].match(/^<@&(\d+)>$/)
        if (regex) {
          content = regex[0]
        }
      } else if (this.argDefs[i].mention == 'channel') {
        // /^<#(\d+)>$/
        const regex = args[i].match(/^<#(\d+)>$/)
        if (regex) {
          content = regex[0]
        }
      } else {
        content = args[i]
      }
      if (!content) {
        await message.reply(`Error parsing argument ${this.argDefs[i].name}`)
        return
      }
      if (this.argDefs[i].mention) {
        content = content
          .replace('<', '')
          .replace('>', '')
          .replace('@', '')
          .replace('!', '')
          .replace('#', '')
          .replace('&', '')
      }
      argObj[this.argDefs[i].name] = content
    }

    // check user cooldowns
    if (this.cooldown) {
      // if command has cooldown
      if (this.cooldownTimers.has(message.author.id)) {
        // if author has a timestamp set
        const timestamp = this.cooldownTimers.get(message.author.id)
        if (timestamp && timestamp + this.cooldown > Date.now()) {
          // if they're still cooling down
          await message.reply(
            'You are doing that too fast\nPlease wait another `' +
              Math.ceil((timestamp + this.cooldown - Date.now()) / 1000) +
              '` seconds before trying that again'
          )
          return
        }
      }
      this.cooldownTimers.set(message.author.id, Date.now())
    }
    try {
      this.func(message, bot, argObj).catch((err) => {
        log.error(err)
        log.trace(this.name)
        log.debug(err.stack)
        message.reply(
          'Uh oh! Something went wrong! Check the command was written properly, otherwise reach out to me at ' +
            bot.cfg.get('gh_link')
        )
      })
    } catch (e) {
      log.error('Failed to invoke command')
      log.trace(this.name)
      await message.reply(
        'Uh oh! Something went wrong! Check the command was written properly, otherwise reach out to me at ' +
          bot.cfg.get('gh_link')
      )
    }
  }
}
