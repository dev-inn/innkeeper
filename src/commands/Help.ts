import Command from '../Command'
import Discord from 'discord.js'

const cmd = new Command('help', ['command_name'], async (message, bot, args) => {
    let prefix = bot.cfg.get('prefix')
    if (message.guild) {
        // if guild has custom prefix use that, otherwise default
        prefix = (await bot.DB.getServerPrefix(message.guild.id)) || bot.cfg.get('prefix')
    }

    // if args includes a command name and it exists
    if (args.command_name) {
        const command = bot.commands.get(args.command_name)
        if (command) {
            message.channel.send(`\`${command.usageString(prefix)}\``)
            return
        } else {
            message.channel.send('Unknown command ;(')
        }
    }
    // displays all commands
    const embed = new Discord.MessageEmbed()
    embed.setTitle(bot.cfg.get('bot_name') + "'s Commands")
    let text = ''
    bot.commands.each((command) => {
        text += '`' + command.usageString(prefix) + `\` - ${command.description}\n\n`
    })
    embed.setDescription(text)
    embed.setThumbnail(bot.cfg.get('pfp'))
    embed.setFooter(`Thank you for using ${bot.cfg.get('bot_name')}`)
    embed.setColor('LUMINOUS_VIVID_PINK')
    message.reply(embed)
})

cmd.guildOnly = false
cmd.alias('h')
cmd.cooldown = 10000
cmd.description = 'Displays this help message'

export default cmd
