import Command from '../../../Command'
import Discord from 'discord.js'
import { getTopTenUsersByRep } from '../utils/user'

const cmd = new Command('leaderboard', [], async (message, bot, args) => {
  if (!message.guild) {
    return // not really any need for a message as the command.invoke() wouldn't allow this to run if not in a guild
  }
  const users = await getTopTenUsersByRep(message.guild.id)

  const embed = new Discord.MessageEmbed()
  embed.setTitle(`${message.guild.name}'s Leaderboard`)
  embed.setThumbnail(bot.cfg.get('pfp'))
  embed.setFooter(`Thank you for using ${bot.cfg.get('bot_name')}`)
  for (let i = 0; i < users.length; i++) {
    const u = users[i]
    embed.addField(`#${i + 1} `, `<@${u.userid}> | ${u.reputation}`)
  }
  await message.channel.send(embed)
})

cmd.guildOnly = true
cmd.alias('l')
cmd.description = 'Displays a leaderboard of the top players by reputation'

export default cmd
