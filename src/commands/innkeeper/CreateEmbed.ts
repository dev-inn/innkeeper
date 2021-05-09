import Command from '../../Command'
import Discord from 'discord.js'

const cmd = new Command(
    'createembed',
    [
        { name: 'color', optional: true }
    ],
    async (message, bot, args) => {
        let argColor;
        let color;
        try {
            argColor = args.color;
        } catch (e) {
            await message.reply("Error parsing arguments");
            return;
        }
        const regex = argColor.match(/^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/);
        if (regex) {
            color = argColor;
        } else {
            await message.reply("Invalid hex");
            return;
        }
        
        const embed = new Discord.MessageEmbed()
        embed.setDescription('This is an embed message')
        if (color) {
            embed.setColor(color);
        }
        await message.channel.send(embed)
})

cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = 'Creates an empty embed'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
