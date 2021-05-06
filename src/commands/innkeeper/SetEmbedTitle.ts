import Command from '../../Command'
import Discord from 'discord.js'

const cmd = new Command(
    'setembedtitle',
    [
        { name: 'message_id', optional: false },
        { name: 'message_content', optional: true }
    ],
    async (message, bot, args) => {
        const words = message.content.split(/ +/)
        const input = message.content.slice(words[0].length + args.message_id.length + 1)

        const msg = await message.channel.messages.fetch(args.message_id)
        if (!msg) {
            await message.channel.send("Couldn't find the specified message")
            return
        }
        const embed = msg.embeds[0]
        embed.setTitle(input)
        await msg.edit(embed)
        await message.channel.send('Success!')
    }
)

cmd.guildOnly = true
cmd.alias('setembedtitle')
cmd.alias('etitle')
cmd.cooldown = 5000
cmd.description = 'Sets the description of a specified embed message'
cmd.rejectExtraArgs = false
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
