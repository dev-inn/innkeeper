# commands.py

import discord

# local imports
# from Database import database as db

from src.Commands import Command
from src.Database import DB
from src.ranks import Rank


class Commands:

    def get_command(self, name):
        if name in self.command_registry:
            return self.command_registry[name]
        elif name in self.hidden_command_registry:
            return self.hidden_command_registry[name]
        else:
            return None

    def exists(self, name):
        return name in self.command_registry or name in self.hidden_command_registry

    def register(self, cmd):
        if cmd.name in self.command_registry:
            print('WARNING: ' + cmd.name
                  + 'is already registered. Overwriting.')
        self.command_registry[cmd.name] = cmd

        if cmd.shorthand and cmd.shorthand in self.hidden_command_registry:
            print('WARNING: ' + cmd.shorthand
                  + 'is already registered. Overwriting.')
        self.hidden_command_registry[cmd.shorthand] = cmd

    def __init__(self, discordclient, botdata, db: DB):
        self.botdata = botdata
        self.discordclient = discordclient
        self.db = db

        self.command_registry = {}

        # these do not show up in help section
        self.hidden_command_registry = {}

        self.register_commands()

    # -------------------------------------------------------------------------- #
    #  Command Implementations                                                   #
    # -------------------------------------------------------------------------- #

    async def help(self, message):
        """
        Creates and sends a discord embed with a list of all command names and
        descriptions avalable in the command_registry.
        """
        prefix = self.botdata.get('prefix')
        url = self.botdata.get('gh_link')

        embed = discord.Embed(title="Command list", color=0x215FF3)
        embed.set_thumbnail(
            url="https://cdn.discordapp.com/attachments/525140186762575873/837189807411036200/unknown.png")
        embed.add_field(name='Prefix',
                        value=prefix, inline=False)
        for cmd_name in self.command_registry:
            cmd = self.command_registry[cmd_name]
            embed.add_field(name=cmd.name + ' ' + cmd.args,
                            value=cmd.description, inline=False)
        embed.add_field(name='Need support?',
                        value=url, inline=False)

        await message.channel.send(embed=embed)

    async def award(self, message):
        """
        Awards a user with a reputation point.
        """
        contents = message.content.split(' ')
        if len(contents) == 1:
            await message.channel.send(
                'This command needs a username. Try `' + self.botdata.get('prefix')
                + 'award <username> <?amount>`.')
            return
        elif len(contents) > 3:
            await message.channel.send(
                'Too many words. Try `' + self.botdata.get('prefix')
                + 'award <username> <?amount>`.')
            return
        elif len(message.mentions) != 1:
            await message.channel.send(
                'Expected a mention. Did you mean `' + self.botdata.get('prefix')
                + 'award @' + contents[1] + '`?')
            return
        user = message.mentions[0]
        if user == message.author:
            await message.channel.send('You can\'t award yourself!')
            return

        amt = 1
        if len(contents) == 3:
            try:
                amt = int(contents[2])
            except Exception as e:
                print("failed to parse amount")
                print(e)

        if self.db.get_credits(message.author.id) < amt:
            await message.channel.send(
                'Sorry, ' + message.author.mention + ', you dont have enough awards left'
                + 'to give. Credits reload every 6 hours.')
            return

        reputation = self.db.award(message.author.id, user.id, quantity=amt)
        await message.channel.send('Awarded ' + str(amt) + ' reputation to ' + user.mention + '. ' +
                                   message.author.mention + ' has ' + str(self.db.get_credits(message.author.id)) +
                                   ' remaining credits.')
        Rank.getRankForRep(reputation).assign_rank(user.id, self.db)

    async def reputation(self, message):
        """
        Get the reputation of a user.
        """
        contents = message.content.split(' ')
        user = message.author
        if len(message.mentions) == 1:
            user = message.mentions[0]
        elif len(contents) > 1:
            await message.channel.send(
                'Too many words. Try `' + self.botdata.get('prefix')
                + 'reputation <username>`.')
            return
        uid = user.id  # key to the database

        reputation = self.db.get_reputation(uid)

        await message.channel.send(user.mention + ' is rank '
                                   + str(self.db.get_rank(user.id)) + ' with ' + str(reputation)
                                   + ' reputation.')

    async def leaderboard(self, message):
        """
        Creates and sends a discord embed with a list of the top users by xp and
        reputation points available in (somewhere).
        """
        embed = discord.Embed(title="Leaderboard")
        embed.set_thumbnail(
            url="https://cdn.discordapp.com/attachments/525140186762575873/837189807411036200/unknown.png")
        # embed.add_field(name='#1', value='tests User', inline=False)
        rows = self.db.leaderboard()
        i = 0
        for row in rows:
            i += 1
            embed.add_field(name='#' + str(i) + ' | Reputation: ' + str(row[1]),
                            value=(await self.discordclient.fetch_user(row[0])).mention, inline=False)

        await message.channel.send(embed=embed)

    # -------------------------------------------------------------------------- #
    # Register Commands                                                          #
    # -------------------------------------------------------------------------- #

    def register_commands(self):

        self.register(Command('help', None,
                              'Shows a list of available commands.', self.help, 'h'))

        self.register(Command('award', '<username> <?amount>',
                              'Awards a user with a reputation point', self.award, 'a'))

        self.register(Command('reputation', '<username>',
                              'Get the rank and reputation of a user.', self.reputation, 'r'))

        self.register(Command('leaderboard', None,
                              'Shows a list of the top users by xp and reputation points.',
                              self.leaderboard, 'l'))
