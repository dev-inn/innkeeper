import Command from '../Command'
import validator from 'validator'
import toInt = validator.toInt
import Transaction, { IncrementDecrementOptionsWithBy } from 'sequelize'
import Sequelize from 'sequelize'
import { GuildMember } from 'discord.js'

const cmd = new Command('award', ['user', '?amount'], async (message, bot, args) => {
    let amount = toInt(args['?amount'])
    if (!amount) {
        amount = 1
    }
    if (!message.member || !message.guild) {
        await message.reply('Error getting user guild information')
        return
    }
    const user = await bot.DB.getUserInServer(message.member.id, message.guild.id)

    const userCreds = <number>user?.get('credits')
    if (userCreds < amount) {
        await message.reply('You dont have enough credits for that :(')
        return
    }

    if (message.mentions.members?.size !== 1) {
        await message.reply('Please mention one user')
        return
    }
    const key = <string>message.mentions.members.firstKey()
    const mentionedUser = <GuildMember>message.mentions.members.get(key)
    const mentionedUserEntry = await bot.DB.getUserInServer(mentionedUser.user.id, mentionedUser.guild.id)
    await user.decrement('credits', { by: amount })
    await mentionedUserEntry.increment('reputation', { by: amount })

    await user.save()
    await mentionedUserEntry.save()

    // message.channel.send(message.member.)
})

cmd.guildOnly = true
cmd.alias('a')
cmd.cooldown = 5000
cmd.description = 'Awards the specified player some reputation points'

export default cmd
