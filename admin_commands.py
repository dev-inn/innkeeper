# admin_commands.py
# these are only available to admin users
import bot

admin_command_registry = {}

# local imports
import database as db
from commands import Command

###--------------------------------------------------------------------------###
### Command Implementations                                                  ###
###--------------------------------------------------------------------------###

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
            'Try `' + bot.botdata[0] + 'nuke <username>`.')
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
        await message.channel.send('Try `' + bot.botdata[0] + 'setCredits <user> <amount>')
        return
    try:
        amt = int(contents[2])
    except Exception:
        await message.channel.send('Invalid amount, must be integer amount of credits')
        return
    db.setCredits(user.id, amt)
    await message.channel.send('Successfully set ' + user.mention + '\'s credits to ' + str(amt))

###--------------------------------------------------------------------------###
### Register Commands                                                        ###
###--------------------------------------------------------------------------###

Command('nuke', None,
'Delete a user from the reputation database.',
nuke).register(admin_command_registry)

Command('setcredits', '<username> <amount>', 'Sets a users credits to specified amount',
setCredits).register(admin_command_registry)
