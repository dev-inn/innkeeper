import Command from '../../Command'

const cmd = new Command(
    'reputation',
    [{ name: 'user', optional: true, mention: 'user' }],
    async (message, bot, args) => {
        if (!message.guild || !message.member) {
            await message.reply('You must be in a server to use that')
            return
        }
        let userid = args.user
        if (!userid) {
            userid = message.member.id
        }

        const userEntry = await bot.DB.getUserInServer(userid, message.guild.id)
        const rep = userEntry.reputation
        await message.channel.send(`<@${userid}> has \`${rep}\` reputation`)
    }
)

cmd.guildOnly = true
cmd.alias('rep')
cmd.alias('r')
cmd.description = 'Shows a users reputation'

export default cmd
