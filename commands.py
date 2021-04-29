# commands.py

import os
import discord
import sqlite3

command_registry = { }

class Command:
    def __init__(self, name, description, function):
        self.name = name
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
    embed=discord.Embed(title="Command list")
    for cmd_name in command_registry:
        cmd = command_registry[cmd_name]
        embed.add_field(name=cmd.name, value=cmd.description, inline=False)
    await message.channel.send(embed=embed)

Command('help', 'Shows a list of available commands', help).register()

async def award(message):
    '''
    Awards a user with a reputation point.
    '''
    user = message.content.split(' ')[1]
    await message.channel.send('Awarded 1 reputation to ' + user)

Command('help', 'Shows a list of available commands', help).register()
