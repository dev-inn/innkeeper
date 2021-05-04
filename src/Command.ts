import Discord, { Permissions } from 'discord.js'
import { Bot } from './Bot'

export default class {
    argNames: string[]
    func: (
        message: Discord.Message,
        bot: Bot,
        db: any,
        args: { [key: string]: string }
    ) => void
    cooldown = 0 // time in seconds of command usage cooldown per user
    guildOnly = true
    aliases: string[] = []
    requiredPermissions: string[] = []
    name: string

    /**
     * Adds a new alias
     * @param name the string to alias with the command*/
    alias(name: string) {
        this.aliases.push(name)
    }

    constructor(
        name: string,
        args: string[],
        func: (
            message: Discord.Message,
            bot: Bot,
            db: any,
            args: { [key: string]: string }
        ) => void
    ) {
        this.func = func
        this.argNames = args
        this.name = name
    }

    /**
     * Invokes the command's function
     * @param message the message object provided by discord
     * @param bot instance of Bot class
     * @param db instance of db class for the server the message originates from*/
    invoke(message: Discord.Message, bot: Bot, db: any) {
        if (this.guildOnly && !message.guild) {
            return
        }
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
        this.func(message, bot, db, argObj)
    }
}
