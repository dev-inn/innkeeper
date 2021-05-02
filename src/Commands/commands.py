# commands.py

import discord

# local imports
# from Database import database as db
from src.Botdata import Botdata
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

    def __init__(self, discordclient, botdata: Botdata):
        self.botdata = botdata
        self.discordclient = discordclient

        self.command_registry = {}

        # these do not show up in help section
        self.hidden_command_registry = {}

        self.register_commands()

    # -------------------------------------------------------------------------- #
    #  Command Implementations                                                   #
    # -------------------------------------------------------------------------- #

    async def help(self, message, db: DB, cmd: Command):
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

    async def award(self, message, db: DB, cmd: Command):
        """
        Awards a user with a reputation point.
        """
        contents = message.content.split(' ')
        if len(contents) == 1 or len(contents) > 3:
            await cmd.send_usage_guide(message)
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

        if db.get_credits(message.author.id) < amt:
            await message.channel.send(
                'Sorry, ' + message.author.mention + ', you dont have enough awards left'
                + 'to give. Credits reload every 6 hours.')
            return

        reputation = db.award(message.author.id, user.id, quantity=amt)
        await message.channel.send('Awarded ' + str(amt) + ' reputation to ' + user.mention + '. ' +
                                   message.author.mention + ' has ' + str(db.get_credits(message.author.id)) +
                                   ' remaining credits.')

        oldrankid = db.get_user_rank(user.id)
        rank = db.get_rank_by_rep(reputation)
        if rank[0] == oldrankid:
            return
        db.set_rank(user.id, rank[0])
        await message.channel.guild.fetch_roles()  # updates roles from server
        newrole = message.channel.guild.get_role(rank[3])
        try:
            oldrole = message.channel.guild.get_role(db.get_rank(oldrankid)[3])
            if newrole != oldrole:
                await user.remove_roles(oldrole)
        except TypeError:  # just means there is no old role
            pass
        if newrole not in user.roles:
            await user.add_roles(newrole)

    async def list_ranks(self, message, db: DB, cmd: Command):
        ranks = db.get_all_ranks()
        embed = discord.Embed(title=message.channel.guild.name + "'s Ranks")
        embed.set_thumbnail(
            url="https://cdn.discordapp.com/attachments/525140186762575873/837189807411036200/unknown.png")
        roles = await message.channel.guild.fetch_roles()
        level = len(ranks)
        for rank in ranks:
            level -= 1
            roleid = rank[3]

            name = ''
            for role in roles:
                if role.id == roleid:
                    name = role.mention
            rep = str(rank[1])
            budget = str(rank[2])
            text = 'Name: ' + name + '\nRequired rep: ' + rep + '\nCredit budget: ' + budget
            embed.add_field(name=str(level) + ') ', value=text, inline=False)
        await message.channel.send(embed=embed)

    async def reputation(self, message, db: DB, cmd: Command):
        """
        Get the reputation of a user.
        """
        contents = message.content.split(' ')
        user = message.author
        if len(message.mentions) == 1:
            user = message.mentions[0]
        elif len(contents) > 1:
            await cmd.send_usage_guide(message)
            return
        uid = user.id  # key to the database

        reputation = db.get_reputation(uid)
        await message.channel.guild.fetch_roles()  # update roles cache
        await message.channel.send(user.mention + ' is rank '
                                   + message.channel.guild.get_role(
            db.get_rank(db.get_user_rank(user.id))[3]).name + ' with ' + str(reputation)
                                   + ' reputation.')

    async def leaderboard(self, message, db: DB, cmd: Command):
        """
        Creates and sends a discord embed with a list of the top users by xp and
        reputation points available in (somewhere).
        """
        server = message.channel.guild.name
        embed = discord.Embed(title=server + "'s Leaderboard")
        embed.set_thumbnail(
            url="https://cdn.discordapp.com/attachments/525140186762575873/837189807411036200/unknown.png")
        # embed.add_field(name='#1', value='tests User', inline=False)
        rows = db.leaderboard()
        i = 0
        for row in rows:
            i += 1
            role = db.get_rank(row[2])
            if (role is None):
                rolename = ""
            else:
                roleid = role[3]
                rolename = message.channel.guild.get_role(roleid).name

            embed.add_field(name='#' + str(i),
                            value=(await self.discordclient.fetch_user(
                                row[0])).mention + "\nRank: " + rolename
                                  + "\nReputation: " + str(row[1]),
                            inline=False)

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
        self.register(Command('ranks', None,
                              'Shows a list of all available ranks',
                              self.list_ranks))
