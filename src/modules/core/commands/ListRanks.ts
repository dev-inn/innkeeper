import Command from '../../../Command'
import Discord from 'discord.js'
import { getAllRanksForServer } from '../utils/rank'
const cmd = new Command('listranks', [], async (message, bot, args) => {
  if (!message.guild) {
    return
  }
  const ranks = await getAllRanksForServer(message.guild.id)
  const embed = new Discord.MessageEmbed()
  embed.setTitle(`${message.guild.name}'s Ranks`)
  for (let i = 0; i < ranks.length; i++) {
    const r = ranks[i]
    embed.addField(
      `${ranks.length - i - 1})`,
      `Name: <@&${r.roleid}>\nRequired rep: ${r.entry_rep}\nCredit budget: ${r.budget}`
    )
  }
  embed.setDescription(
    'To receive a rank you must meet the required reputation. Higher ranks will have higher credit budgets, your total credits will be set to this value periodically'
  )
  embed.setThumbnail(bot.cfg.get('pfp'))
  await message.channel.send(embed)
})

cmd.guildOnly = true
cmd.alias('ranks')
cmd.cooldown = 5000
cmd.description = 'List the available reputation ranks for this server'

export default cmd
