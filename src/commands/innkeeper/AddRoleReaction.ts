import Command from '../../Command'

const cmd = new Command(
    'addrolereaction',
    [
        { name: 'message_id', optional: false },
        { name: 'role', optional: false, mention: 'role' },
        { name: 'emoji', optional: false }
    ],
    async (message, bot, args) => {
        const msg = await message.channel.messages.fetch(args.message_id)
        if (!msg) {
            await message.channel.send('Could not find message')
            return
        }
        const emojiObj = bot.emojis.resolveIdentifier(args.emoji)
        if (!emojiObj) {
            await message.channel.send('Invalid emoji')
            return
        }
        if (await bot.DB.getRoleReactionByEmoji(args.message_id, args.emoji)) {
            await message.channel.send("Sorry you can't use the same emoji twice")
            return
        }
        if (!msg.guild) {
            await message.channel.send('Error getting server data')
            return
        }
        await bot.DB.insertRoleReaction(msg.guild.id, msg.id, args.role, emojiObj, msg.channel.id)
        await msg.react(emojiObj)
    }
)

cmd.guildOnly = true
cmd.alias('arr')
cmd.cooldown = 5000
cmd.description = 'Adds an emoji reaction role to a message'

export default cmd
