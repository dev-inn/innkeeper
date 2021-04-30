# admin_commands.py
# these are only available to admin users
import discord

# local imports
from Botdata import Botdata
from Commands import Command
from Database import DB


class Admin_Commands:

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

    def __init__(self, discordclient, botdata:Botdata, db: DB):
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

    async def nuke(self, message):
        """
        Completely resets a user reputation.
        Only to be used by admins.
        """
        if len(message.mentions) == 1:
            user = message.mentions[0]
        else:
            await message.channel.send(
                'Try `' + self.botdata.prefix + 'nuke <username>`.')
            return
        uid = user.id  # key to the database
        self.db.nuke(uid)
        await message.channel.send('Reset ' + user.mention + ' reputation to 0.')

    async def set_credits(self, message):
        """
        Set a users credits to desired amount
        Only to be used by admins
        """
        contents = message.content.split(' ')
        amt = 0
        if len(message.mentions) == 1:
            user = message.mentions[0]
        else:
            await message.channel.send('Try `' + self.botdata.prefix + 'setCredits <user> <amount>')
            return
        try:
            amt = int(contents[2])
        except Exception:
            await message.channel.send('Invalid amount, must be integer amount of credits')
            return
        self.db.set_credits(user.id, amt)
        await message.channel.send('Successfully set ' + user.mention + '\'s credits to ' + str(amt))

    async def newrank(self, message):
        """
        ?newrank <@role> <entry_rep>
        """
        contents = message.content.split(' ')
        amt = 0
        if len(message.role_mentions) == 1:
            user = message.role_mentions[0]
        else:
            await message.channel.send('Try `' + self.botdata.prefix + 'setCredits <user> <amount>')
            return
        try:
            entry_rep = int(contents[2])
        except Exception:
            await message.channel.send('Invalid amount, must be integer amount of credits')
            return
        self.db.set_credits(user.id, amt)
        await message.channel.send('Successfully set ' + user.mention + '\'s credits to ' + str(amt))

    async def help_admin(self, message):
        prefix = self.botdata.prefix
        url = self.botdata.gh_link

        embed = discord.Embed(title="Command list", color=0x215FF3)
        embed.set_thumbnail(
            url="https://cdn.discordapp.com/attachments/525140186762575873/837189807411036200/unknown.png")
        embed.add_field(name='Prefix',
                        value=prefix, inline=False)
        for cmd_name in self.command_registry:
            cmd = self.get_command(cmd_name)
            embed.add_field(name=cmd.name + ' ' + cmd.args,
                            value=cmd.description, inline=False)
        embed.add_field(name='Need support?',
                        value=url, inline=False)

        await message.channel.send(embed=embed)

    async def setprefix(self, message):
        """
        ?setprefix <new_prefix>
        """
        contents = message.content.split(' ')[-1]
        previousPrefix = self.botdata.prefix
        self.botdata.prefix = str(contents)

        await message.channel.send('Successfully set the prefix to `' + contents + '` from `' + previousPrefix + '`')

    ###--------------------------------------------------------------------------###
    ### Register Commands                                                        ###
    ###--------------------------------------------------------------------------###

    def register_commands(self):

        self.register(Command('nuke', None,
                              'Delete a user from the reputation database.',
                              self.nuke, 'n'))

        self.register(Command('setcredits', '<username> <amount>', 'Sets a users credits to specified amount',
                              self.set_credits))

        self.register(Command('newrank', '<role> <entry_reputation>', 'Create a new role for a given reputation level',
                              self.newrank))

        self.register(Command('setprefix', '<new_prefix>', 'Change the prefix used to execute commands',
                              self.setprefix))

        self.register(Command('adminhelp', None, 'Shows this screen', self.help_admin, 'ah'))
