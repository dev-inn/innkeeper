# admin_commands.py
# these are only available to admin users
import discord

admin_command_registry = {}

# local imports
import database as db
from commands import Command

###--------------------------------------------------------------------------###
### Command Implementations                                                  ###
###--------------------------------------------------------------------------###


global botdata


def set_bot_data(data):
    global botdata
    botdata = data


async def nuke(message):
    '''
    Completely resets a user reputation.
    Only to be used by admins.
    '''
    if len(message.mentions) == 1:
        user = message.mentions[0]
    else:
        await message.channel.send(
            'Try `' + botdata[0] + 'nuke <username>`.')
        return
    uid = user.id  # key to the database
    db.nuke(uid)
    await message.channel.send('Reset ' + user.mention + ' reputation to 0.')


async def set_credits(message):
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


async def newrank(message):
    '''
    ?newrank <@role> <entry_rep>
    '''
    contents = message.content.split(' ')
    amt = 0
    if (len(message.role_mentions) == 1):
        user = message.role_mentions[0]
    else:
        await message.channel.send('Try `' + botdata[0] + 'setCredits <user> <amount>')
        return
    try:
        entry_rep = int(contents[2])
    except Exception:
        await message.channel.send('Invalid amount, must be integer amount of credits')
        return
    db.setCredits(user.id, amt)
    await message.channel.send('Successfully set ' + user.mention + '\'s credits to ' + str(amt))


async def help_admin(message):
    prefix = botdata[0]
    url = botdata[2]

    embed = discord.Embed(title="Command list", color=0x215FF3)
    embed.set_thumbnail(url="https://cdn.discordapp.com/attachments/525140186762575873/837189807411036200/unknown.png")
    embed.add_field(name='Prefix',
                    value=prefix, inline=False)
    for cmd_name in admin_command_registry:
        cmd = admin_command_registry[cmd_name]
        embed.add_field(name=cmd.name + ' ' + cmd.args,
                        value=cmd.description, inline=False)
    embed.add_field(name='Need support?',
                    value=url, inline=False)

    await message.channel.send(embed=embed)

async def setprefix(message):
    '''
    ?setprefix <new_prefix>
    '''
    contents = message.content.split(' ')[-1]
    previousPrefix = botdata[0]
    botdata[0] = str(contents)

    await message.channel.send('Successfully set the prefix to `' + contents + '` from `' + previousPrefix + '`')


###--------------------------------------------------------------------------###
### Register Commands                                                        ###
###--------------------------------------------------------------------------###

Command('nuke', None,
        'Delete a user from the reputation database.',
        nuke).register(admin_command_registry)

Command('setcredits', '<username> <amount>', 'Sets a users credits to specified amount',
        set_credits).register(admin_command_registry)

Command('newrank', '<role> <entry_reputation>', 'Create a new role for a given reputation level',
        newrank).register(admin_command_registry)

Command('setprefix', '<new_prefix>', 'Change the prefix used to execute commands',
        setprefix).register(admin_command_registry)

Command('adminhelp', None, 'Shows this screen', help_admin, 'ah').register(admin_command_registry)

