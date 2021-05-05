import Command from '../Command'
import validator from 'validator'
import toInt = validator.toInt

const cmd = new Command('award', ['user', '?amount'], async (message, bot, args) => {
    let amount = toInt(args['?amount'])
    if (!amount) amount = 1
    let user;
    if (message.member && message.guild) {
        user = await bot.DB.getUserInServer(message.member.id, message.guild.id)
    }
    if (!user) {
        message.reply('Error getting user guild information')
        return
    }
    let userCreds = <number>user?.get('credits')
    if (userCreds < amount) {
        await message.reply("You dont have enough credits for that :(")
    }
})

cmd.guildOnly = true
cmd.alias('a')
cmd.cooldown = 5000
cmd.description = 'Awards the specified player some reputation points'

export default cmd
