import Command from '../../Command'
import Discord from 'discord.js'

const cmd = new Command('createembed', [], async (message, bot, args) => {
    const embed = new Discord.MessageEmbed()
    embed.setDescription('This is an embed message')
    await message.channel.send(embed)
})

cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = 'Creates an empty embed'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
