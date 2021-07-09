import Command from '../../Command'
import Discord from 'discord.js'

const cmd = new Command(
    'removerolereaction',
    [
        { name: 'message_id', optional: false },
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
        if (!msg.guild) {
            await message.channel.send('Error getting server data')
            return
        }
        await bot.DB.removeRoleReactionByEmoji(args.message_id, emojiObj)

        const reactions = await msg.reactions.cache
        reactions.forEach((react) => {
            if (react.emoji.toString() == args.emoji) {
                react.remove()
                return
            }
        })
    }
)

cmd.guildOnly = true
cmd.alias('rrr')
cmd.cooldown = 5000
cmd.description = 'Removes an emoji reaction role from a message'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
