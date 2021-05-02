# admin_commands.py
# these are only available to admin users
import discord

# local imports
from src.Botdata import Botdata
from src.Commands import Command
from src.Commands import commands
from src.Database import DB


class AdminCommands:
    # inherit funcs from Commands since they're identical
    get_command = commands.Commands.get_command

    exists = commands.Commands.exists

    register = commands.Commands.register

    def __init__(self, discordclient, botdata: Botdata):
        self.botdata = botdata
        self.discord_client = discordclient

        self.command_registry = {}

        # these do not show up in help section
        self.hidden_command_registry = {}

        self.register_commands()

    # -------------------------------------------------------------------------- #
    #  Command Implementations                                                   #
    # -------------------------------------------------------------------------- #

    async def nuke(self, message, db: DB, cmd: Command):
        """
        Completely resets a user reputation.
        Only to be used by admins.
        """
        if len(message.mentions) == 1:
            user = message.mentions[0]
        else:
            await cmd.send_usage_guide(message)
            return
        uid = user.id  # key to the database
        db.nuke(uid)
        await message.channel.send('Reset ' + user.mention + ' reputation to 0.')

    async def set_credits(self, message, db: DB, cmd: Command):
        """
        Set a users credits to desired amount
        Only to be used by admins
        """
        contents = message.content.split(' ')
        amt = 0
        if len(message.mentions) == 1:
            user = message.mentions[0]
        else:
            await cmd.send_usage_guide(message)
            return
        try:
            amt = int(contents[2])
        except ValueError:
            await message.channel.send('Invalid amount, must be integer amount of credits')
            return
        db.set_credits(user.id, amt)
        await message.channel.send('Successfully set ' + user.mention + '\'s credits to ' + str(amt))

    async def newrank(self, message, db: DB, cmd: Command):
        """
        ?newrank <@role> <entry_rep>
        """
        contents = message.content.split(' ')
        amt = 0
        if len(message.role_mentions) == 1:
            user = message.role_mentions[0]
        else:
            await cmd.send_usage_guide(message)
            return
        try:
            entry_rep = int(contents[2])
        except Exception:
            await message.channel.send('Invalid amount, must be integer amount of credits')
            return
        db.set_credits(user.id, amt)
        await message.channel.send('Successfully set ' + user.mention + '\'s credits to ' + str(amt))

    async def help_admin(self, message, db: DB, _cmd: Command):
        prefix = self.botdata.get('prefix')
        url = self.botdata.get('gh_link')

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

    async def set_prefix(self, message, db: DB, cmd: Command):
        """
        ?setprefix <new_prefix>
        """
        contents = message.content.split(' ')[-1]
        previous_prefix = self.botdata.get('prefix')
        self.botdata.set('prefix', str(contents))

        await message.channel.send('Successfully set the prefix to `' + contents + '` from `' + previous_prefix + '`')

    # -------------------------------------------------------------------------- #
    #  Register Commands                                                         #
    # -------------------------------------------------------------------------- #

    def register_commands(self):

        self.register(Command('nuke', None,
                              'Delete a user from the reputation database.',
                              self.nuke, 'n'))

        self.register(Command('setcredits', '<username> <amount>', 'Sets a users credits to specified amount',
                              self.set_credits))

        self.register(Command('newrank', '<role> <entry_reputation>', 'Create a new role for a given reputation level',
                              self.newrank))

        self.register(Command('setprefix', '<new_prefix>', 'Change the prefix used to execute commands',
                              self.set_prefix))

        self.register(Command('adminhelp', None, 'Shows this screen', self.help_admin, 'ah'))
