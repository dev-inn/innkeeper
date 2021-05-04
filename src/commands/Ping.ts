import Command from '../Command'

const cmd = new Command('ping', [], (message, bot, args) => {
    message.channel.send('Pong!')
})

cmd.guildOnly = false
cmd.alias('p')
cmd.cooldown = 5000

export default cmd
