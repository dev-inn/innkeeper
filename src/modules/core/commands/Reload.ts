import Command from '../../../Command'

/**Doesn't actually work yet as all imports are cached*/
const cmd = new Command('reload', [], async (message, bot, args) => {
  await bot.loadModules()
  message.channel.send(`Reloaded \`${bot.commands.size}\` commands`)
})

cmd.guildOnly = false
cmd.alias('rs')
cmd.cooldown = 30000
cmd.description = '~~Reloads commands from file~~'

export default cmd
