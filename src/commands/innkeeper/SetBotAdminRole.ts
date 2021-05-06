import Command from '../../Command'
import Discord from 'discord.js'

const cmd = new Command(
    'setbotadminrole',
    [{ name: 'role', optional: false, mention: 'role' }],
    async (message, bot, args) => {
        if (!message.guild) {
            return
        }
        await bot.DB.setServerAdminRole(message.guild.id, args.role)
    }
)

cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = 'Sets admin role for the bot in this server'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
