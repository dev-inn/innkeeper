import Discord from 'discord.js'
import { Bot } from './Bot'

export default class {
    /**List of argument names*/
    argNames: string[]
    private readonly func: (message: Discord.Message, bot: Bot, args: { [key: string]: string }) => void
    /**Cooldown time in ms*/
    cooldown = 5000 // time in milliseconds of command usage cooldown per user
    /**Whether command can only be used in servers*/
    guildOnly = true
    /**Other single-word strings that should trigger this command*/
    aliases: string[] = []
    /**List of permissions that are required to use this command*/
    requiredPermissions: string[] = []
    /**Name of the command, can be used to call the command*/
    name: string // command name
    private cooldownTimers = new Discord.Collection<string, number>() // userid:timestamp
    /**Displayed by the help command to describe the command function*/
    description = ''
    /**
     * Adds a new alias
     * @param name the string to alias with the command*/
    alias(name: string) {
        this.aliases.push(name)
    }

    constructor(name: string, args: string[], func: (message: Discord.Message, bot: Bot, args: { [key: string]: string }) => void) {
        this.func = func
        this.argNames = args
        this.name = name.toLowerCase()
    }

    usageString(prefix: string) {
        let argsString = ''
        for (let i = 0; i < this.argNames.length; i++) {
            argsString += ` <${this.argNames[i]}>`
        }
        return prefix + this.name + argsString
    }

    /**
     * Invokes the command's function
     * @param message the message object provided by discord
     * @param bot instance of Bot class*/
    invoke(message: Discord.Message, bot: Bot) {
        // check if can be run in this context
        if (this.guildOnly && !message.guild) {
            return
        }
        // check permissions
        // todo allow dev role to bypass
        if (this.requiredPermissions) {
            // if command needs perms
            for (let i = 0; i < this.requiredPermissions.length; i++) {
                // for each required perm
                if (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    !message.member?.hasPermission(this.requiredPermissions[i]) // user doesnt have perm
                ) {
                    return
                }
            }
        }

        // convert args to key:value object
        const args = message.content.trim().split(/ +/) // splits on space and removes duplicate spacing
        args.shift() // removes command from start
        if (args.length > this.argNames.length) {
            message.channel.send('Too many arguments')
            return
        }
        const argObj: { [key: string]: string } = {}
        for (let i = 0; i < args.length; i++) {
            argObj[this.argNames[i]] = args[i]
        }

        // check user cooldowns
        if (this.cooldown) {
            // if command has cooldown
            if (this.cooldownTimers.has(message.author.id)) {
                // if author has a timestamp set
                const timestamp = this.cooldownTimers.get(message.author.id)
                if (timestamp && timestamp + this.cooldown > Date.now()) {
                    // if they're still cooling down
                    message.reply(
                        'You are doing that too fast\nPlease wait another `' +
                            Math.ceil((timestamp + this.cooldown - Date.now()) / 1000) +
                            '` seconds before trying that again'
                    )
                    return
                }
            }
            this.cooldownTimers.set(message.author.id, Date.now())
        }
        this.func(message, bot, argObj)
    }
}
