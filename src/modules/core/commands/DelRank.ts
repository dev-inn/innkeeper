import Command from '../../../Command'
import Discord from 'discord.js'
import { getRankByRep } from '../utils/rank'

const cmd = new Command('delrank', [{ name: 'entry_rep', optional: false }], async (message, bot, args) => {
  if (!message.guild) {
    return
  }
  const rank = await getRankByRep(message.guild.id, parseInt(args.entry_rep))
  if (!rank) {
    await message.reply("Couldn't find the rank to delete")
    return
  }
  await rank.destroy()
  await message.reply('Success!\nP.S. Some users may still have the role from this rank')
})

cmd.guildOnly = true
cmd.cooldown = 5000
cmd.description = 'Deletes a pre-existing rank'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
