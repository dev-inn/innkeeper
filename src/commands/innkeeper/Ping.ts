import Command from '../../Command'

const cmd = new Command('ping', [], async (message, bot, args) => {
    await message.channel.send('Pong!')
})

cmd.guildOnly = false
cmd.alias('p')
cmd.cooldown = 5000
cmd.description = 'Pong!'

export default cmd
