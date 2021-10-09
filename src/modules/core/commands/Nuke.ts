import Command from '../../../Command'
import Discord from 'discord.js'
import { nukeUserFromServer } from '../utils/user'

const cmd = new Command(
  'nuke',
  [{ name: 'user', optional: false, mention: 'user' }],
  async (message, bot, args) => {
    if (!message.guild) {
      return // this is purely so typescript doesn't cry that its possibly null, command.invoke() handles that check
    }
    const deletedCount = await nukeUserFromServer(args.user, message.guild.id)
    if (deletedCount != 0) {
      await message.channel.send(`Successfully destroyed <@${args.user}>`)
    } else {
      await message.channel.send(`Found nothing to delete`)
    }
  }
)

cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = "Removes a user from this server's database"
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
