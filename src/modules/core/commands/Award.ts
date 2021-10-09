import Command from '../../../Command'
import { logger } from '@noodlewrecker7/logger'
import { getUserInServer } from '../utils/user'
import { getRankByRep } from '../utils/rank'

const log = logger.Logger

const cmd = new Command(
  'award',
  [
    { name: 'user', optional: false, mention: 'user' },
    { name: 'amount', optional: true }
  ],
  async (message, bot, args) => {
    let amount: number
    amount = parseInt(args['amount'])
    if (!Number.isInteger(amount)) {
      amount = 1
    }
    if (!message.member || !message.guild) {
      await message.reply('Error getting user guild information')
      return
    }
    const user = await getUserInServer(message.member.id, message.guild.id)

    const userCreds = <number>user?.credits
    if (userCreds < amount) {
      await message.reply('You dont have enough credits for that :(')
      return
    }

    const mentionedUser = await message.guild.members.fetch(args.user)
    if (mentionedUser.id == message.author.id) {
      await message.reply('Sorry you cant award yourself ;(')
      return
    }
    const mentionedUserEntry = await getUserInServer(mentionedUser.user.id, mentionedUser.guild.id)
    await user.decrement({ credits: amount })

    await mentionedUserEntry.increment({ reputation: amount })
    await user.save()
    await mentionedUserEntry.save()

    const text = `${mentionedUser} has received \`${amount}\` reputation. They now have \`${
      mentionedUserEntry.reputation + amount
    }\`` // using the current value of reputation gives the value from before it was incremented, so adding the two gives the accurate total
    await message.channel.send(text)

    const oldRank = await getRankByRep(message.guild.id, mentionedUserEntry.reputation)
    const newRank = await getRankByRep(message.guild.id, mentionedUserEntry.reputation + amount)
    if (!newRank) {
      log.debug('rank not exist')
      return
    }
    if (oldRank && newRank.equals(oldRank)) {
      log.debug('ranks equal')
      return
    }
    const discordUser = await message.guild.members.fetch(args.user)
    try {
      if (oldRank?.roleid) {
        await discordUser.roles.remove(<string>oldRank?.roleid)
      }
      await discordUser.roles.add(<string>newRank.roleid)
    } catch (e) {
      await message.channel.send('Error setting rank roles, please contact a server admin')
    }
  }
)

cmd.guildOnly = true
cmd.alias('a')
cmd.description = 'Awards the specified player some reputation points'

export default cmd
