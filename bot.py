# bot.py

import os
import discord
import sqlite3

# local imports
import commands

prefix = "?"

# load secrets
TOKEN = os.environ.get("DISCORD_TOKEN")

# connect to database
con = sqlite3.connect('reputation.db')

client = discord.Client() # set up bot with discord api

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!') # just a debug message to let us know bot is up and running

@client.event
async def on_message(message):
    print("bot received a message")

    if message.author == client.user: # bot won't reply to itself
        return
    if(not message.content.startswith(prefix)): # if the message doesn't start with the prefix, ignore
        return

    command = message.content.replace(prefix,'').split(" ")[0]
    if command in command_registry:
        command_registry[command].invoke(message)
    else:
        await message.channel.send('Oops, I don\'t recognize that command')

client.run(TOKEN) # run the bot
