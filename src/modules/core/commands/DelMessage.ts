import Command from '../../../Command'
import Discord from 'discord.js'

const cmd = new Command(
  'delmessage',
  [{ name: 'message_id', optional: false }],
  async (message, bot, args) => {
    const msg = await message.channel.messages.fetch(args.message_id)
    if (!msg.deletable) {
      await message.reply("Sorry I couldn't delete that message")
      return
    }

    await msg.delete()
    await message.delete()
  }
)

cmd.guildOnly = true
cmd.alias('delmsg')
cmd.cooldown = 5000
cmd.description = 'Deleted a specified bot message'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]
export default cmd
