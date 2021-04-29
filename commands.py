# commands.py

import discord

# local imports
import database as db

command_registry = {}

# these do not show up in help section
hidden_command_registry = {}

# these are only available to admin users
admin_command_registry = {}

global discordclient # holds a copy of the client object

def setdiscordclient(c): # allows object to be set from outside file
    global discordclient
    discordclient = c


class Command:
    def __init__(self, name, args, description, function, shorthand=None):
        self.name = name
        self.shorthand = shorthand
        self.args = args
        if args is None:
            self.args = ''
        self.description = description
        self.function = function

    def register(self, registry=command_registry):
        if self.name in registry:
            print('WARNING: ' + self.name
                  + 'is already registered. Overwriting.')
        registry[self.name] = self

        if self.shorthand and self.shorthand in hidden_command_registry:
            print('WARNING: ' + self.shorthand
                  + 'is already registered. Overwriting.')
        hidden_command_registry[self.shorthand] = self

    async def invoke(self, message):
        await self.function(message)


###--------------------------------------------------------------------------###
### Command Implementations                                                  ###
###--------------------------------------------------------------------------###

with open('botdata.txt', 'r') as file:
    botdata = file.read().split(",")  # get variables from botdata.txt


async def help(message):
    '''
    Creates and sends a discord embed with a list of all command names and
    descriptions avalable in the command_registry.
    '''

    prefix = botdata[0]
    url = botdata[2]

    embed = discord.Embed(title="Command list", color=0x215FF3)
    embed.set_thumbnail(url="https://cdn.discordapp.com/attachments/525140186762575873/837189807411036200/unknown.png")
    embed.add_field(name='Prefix',
                    value=prefix, inline=False)
    for cmd_name in command_registry:
        cmd = command_registry[cmd_name]
        embed.add_field(name=cmd.name + ' ' + cmd.args,
                        value=cmd.description, inline=False)
    embed.add_field(name='Need support?',
                    value=url, inline=False)

    await message.channel.send(embed=embed)


async def award(message):
    '''
    Awards a user with a reputation point.
    '''
    contents = message.content.split(' ')
    if len(contents) == 1:
        await message.channel.send(
            'This command needs a username. Try `' + botdata[0]
            + 'award <username>`.')
        return
    elif len(contents) > 2:
        await message.channel.send(
            'Too many words. Try `' + botdata[0]
            + 'award <username>`.')
        return
    elif len(message.mentions) != 1:
        await message.channel.send(
            'Expected a mention. Did you mean `' + botdata[0]
            + 'award @' + contents[1] + '`?')
        return
    user = message.mentions[0]
    if user == message.author:
        await message.channel.send('You can\'t award yourself!')
        return
    if db.getCredits(message.author.id) == 0:
        await message.channel.send(
            'Sorry, ' + message.author.mention + ', you have no awards left '
            + 'to give. Credits reload every 6 hours.')
        return

    db.award(message.author.id, user.id)
    await message.channel.send('Awarded 1 reputation to ' + user.mention + '. ' +
                               message.author.mention + ' has ' + str(db.getCredits(message.author.id)) +
                               ' remaining credits.')


async def reputation(message):
    '''
    Get the reputation of a user.
    '''
    contents = message.content.split(' ')
    user = message.author
    if len(message.mentions) == 1:
        user = message.mentions[0]
    elif len(contents) > 1:
        await message.channel.send(
            'Too many words. Try `' + botdata[0]
            + 'reputation <username>`.')
        return
    id = user.id  # key to the database

    reputation = db.getReputation(id)
    plurality = 's'
    if reputation == 1:
        plurality = ''
    await message.channel.send(user.mention + ' has ' + str(reputation)
                               + ' reputation point' + plurality + '.')


async def rank(message):
    '''
    Get the rank of the user.
    '''
    contents = message.content.split(' ')
    user = message.author
    if len(message.mentions) == 1:
        user = message.mentions[0]
    elif len(contents) > 1:
        await message.channel.send(
            'Too many words. Try `' + botdata[0]
            + 'rank <username>`.')
        return
    id = user.id  # key to the database

    await message.channel.send(user.mention + ' is rank #1, level 83.')


async def leaderboard(message):
    '''
    Creates and sends a discord embed with a list of the top users by xp and
    reputation points abailable in (somewhere).
    '''
    embed = discord.Embed(title="Leaderboard")
    # embed.add_field(name='#1', value='Test User', inline=False)
    rows = db.leaderboard()
    i = 0
    for row in rows:
        i += 1
        embed.add_field(name='#' + str(i), value=discordclient.get_user(row[0]).mention + str(row[1]), inline=False)

    await message.channel.send(embed=embed)


async def nuke(message):
    '''
    Completely resets a user reputation.
    Only to be used by admins.
    '''
    contents = message.content.split(' ')
    if len(message.mentions) == 1:
        user = message.mentions[0]
    else:
        await message.channel.send(
            'Try `' + botdata[0] + 'nuke <username>`.')
        return
    id = user.id  # key to the database
    db.nuke(id)
    await message.channel.send('Reset ' + user.mention + ' reputation to 0.')


async def setCredits(message):
    '''
    Set a users credits to desired amount
    Only to be used by admins
    '''
    contents = message.content.split(' ')
    amt = 0
    if (len(message.mentions) == 1):
        user = message.mentions[0]
    else:
        await message.channel.send('Try `' + botdata[0] + 'setCredits <user> <amount>')
        return
    try:
        amt = int(contents[2])
    except Exception:
        await message.channel.send('Invalid amount, must be integer amount of credits')
        return
    db.setCredits(user.id, amt)
    await message.channel.send('Successfully set ' + user.mention + '\'s credits to ' + str(amt))


# xpGain = random.randint(15, 25) -- Use this for getting a random xp to give each time a user sends a message

###--------------------------------------------------------------------------###
### Register Commands                                                        ###
###--------------------------------------------------------------------------###

Command('help', None,
        'Shows a list of available commands.', help, 'h').register()

Command('award', '<username>',
        'Awards a user with a reputation point', award, 'a').register()

Command('reputation', '<username>',
        'Get the reputation of a user.', reputation, 'r').register()

Command('rank', '<username>',
        'Get the rank of a user.', rank).register()

Command('leaderboard', None,
        'Shows a list of the top users by xp and reputation points.',
        leaderboard, 'l').register()

Command('nuke', None,
        'Delete a user from the reputation database.',
        nuke).register(admin_command_registry)

Command('setcredits', '<username> <amount>', 'Sets a users credits to specified amount',
        setCredits).register(admin_command_registry)
