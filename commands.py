# commands.py

import os
import discord
import sqlite3

command_registry = { }

class Command:
    def __init__(self, name, args, description, function):
        self.name = name
        self.args = args
        if args is None:
            self.args = ''
        self.description = description
        self.function = function

    def register(self, registry=command_registry):
        if self.name in command_registry:
            print('WARNING: ' + self.name
                + 'is already registered. Overwriting.')
        command_registry[self.name] = self

    async def invoke(self, message):
        await self.function(message)

###--------------------------------------------------------------------------###
### Command Implementations                                                  ###
###--------------------------------------------------------------------------###

async def help(message):
    '''
    Creates and sends a discord embed with a list of all command names and
    descriptions avalable in the command_registry.
    '''
    embed = discord.Embed(title="Command list")
    for cmd_name in command_registry:
        cmd = command_registry[cmd_name]
        embed.add_field(name=cmd.name + ' ' + cmd.args,
            value=cmd.description, inline=False)
    await message.channel.send(embed=embed)

Command('help', None,
    'Shows a list of available commands.', help).register()

async def award(message):
    '''
    Awards a user with a reputation point.
    '''
    contents = message.content.split(' ')
    if len(contents) == 1:
        await message.channel.send(
            'This command needs a username. Try `?award <username>`.')
        return
    elif len(contents) > 2:
        await message.channel.send(
            'Too many words. Try `?award <username>`.')
        return
    elif len(message.mentions) != 1:
        await message.channel.send(
            'Expected a mention. Did you mean `?award @' + contents[1] +'`?')
        return
    user = message.mentions[0]
    id = user.id # key to the database


    await message.channel.send('Awarded 1 reputation to ' + user.mention + '.')

Command('award', '<username>',
    'Awards a user with a reputation point', award).register()

async def reputation(message):
    '''
    Get the reputation of a user.
    '''
    user = message.content.split(' ')[1]
    await message.channel.send(user + ' has 1 reputation point.')

Command('reputation', '<username>',
    'Get the reputation of a user.', reputation).register()

async def rank(message):
    '''
    Get the rank of the user.
    '''
    user = message.content.split(' ')[1]
    await message.channel.send(user + ' is rank #1, level 83.')

Command('rank', '<username>',
    'Get the rank of a user.', rank).register()

async def leaderboard(message):
    '''
    Creates and sends a discord embed with a list of the top users by xp and
    reputation points abailable in (somewhere).
    '''
    embed = discord.Embed(title="Leaderboard")
    embed.add_field(name='#1', value='Test User', inline = False)
    await message.channel.send(embed=embed)

Command('leaderboard', None,
    'Shows a list of the top users by xp and reputation points.', leaderboard).register()

# xpGain = random.randint(15, 25) -- Use this for getting a random xp to give each time a user sends a message
