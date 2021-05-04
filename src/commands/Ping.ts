import Command from '../Command'

const cmd = new Command('ping', [], (message, bot, db, args) => {
    message.channel.send('Pong!')
})

cmd.guildOnly = false
cmd.alias('p')
cmd.cooldown = 5

export default cmd
