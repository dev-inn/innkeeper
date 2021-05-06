import Command from '../../Command'
import Discord from 'discord.js'

const cmd = new Command('setcredits', [{ name: 'amount', optional: false }], async (message, bot, args) => {
    // todo set credits
    if (!message.member || !message.guild) return
    let amount
    try {
        amount = parseInt(args.amount)
    } catch (e) {
        return
    }
    const userid = message.member?.id
    await bot.DB.setUserCredits(userid, message.guild.id, amount)

    message.channel.send(`Successfully set <@${userid}>'s credits to \`${amount}\``)
})

cmd.guildOnly = false
cmd.cooldown = 5000
cmd.description = 'Sets a users credits'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
