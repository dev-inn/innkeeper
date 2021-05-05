import Command from '../../Command'
import Discord from 'discord.js'

const cmd = new Command('setcredits', [], (message, bot, args) => {
    // todo set credits
})

cmd.guildOnly = false
cmd.cooldown = 5000
cmd.description = 'Sets a users credits'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
