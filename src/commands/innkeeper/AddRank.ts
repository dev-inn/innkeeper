import Command from '../../Command'
import Discord from 'discord.js'

const cmd = new Command(
    'addrank',
    [
        { name: 'role', optional: false, mention: 'role' },
        {
            name: 'entry_rep',
            optional: false
        },
        { name: 'budget', optional: false }
    ],
    async (message, bot, args) => {
        let budget
        let entry_rep
        let role
        try {
            budget = parseInt(args.budget)
            entry_rep = parseInt(args.budget)
            role = args.role
        } catch (e) {
            await message.reply('Error parsing arguments')
            return
        }
        if (!message.guild) return

        const ranks = await bot.DB.getAllRanksForServer(message.guild.id)
        if (ranks.length >= 25) {
            // discord embeds have a max of 25 fields
            await message.reply(
                'Sorry you can only have 25 ranks due to a discord limitation\nPerhaps remove one?'
            )
            return
        }

        const rank = await bot.DB.getRankByRep(message.guild.id, entry_rep)
        if (rank?.entry_rep == entry_rep) {
            await message.reply(
                'A rank with that reputation already exists, try changing the entry_rep requirement'
            )
            return
        }

        try {
            await bot.DB.insertNewRank(message.guild.id, role, entry_rep, budget)
            await message.channel.send(`Made new rank: <@&${role}>`)
        } catch (e) {
            await message.channel.send('Error inserting rank, please contact a server admin')
        }
    }
)

cmd.guildOnly = true
cmd.alias('ar')
cmd.cooldown = 5000
cmd.description = 'Creates a new rank'
cmd.requiredPermissions = [Discord.Permissions.FLAGS.ADMINISTRATOR]

export default cmd
