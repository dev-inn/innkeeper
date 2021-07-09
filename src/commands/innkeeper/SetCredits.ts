import Command from '../../Command'
import Discord from 'discord.js'

const cmd = new Command(
    'setcredits',
    [
        { name: 'user', optional: false, mention: 'user' },
        { name: 'amount', optional: false }
    ],
    async (message, bot, args) => {
        if (!message.guild) return
        if (!args.user) return
        let amount
        try {
            amount = parseInt(args.amount)
        } catch (e) {
            return
        }
        await bot.DB.setUserCredits(args.user, message.guild.id, amount)

        await message.channel.send(`Successfully set <@${args.user}>'s credits to \`${amount}\``)
    }
)

cmd.guildOnly = false
cmd.cooldown = 5000
cmd.description = 'Sets a users credits'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
