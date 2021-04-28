# bot.py
import os
import discord
import sqlite3

prefix = "?"

# load secrets
TOKEN = os.environ.get("DISCORD_TOKEN")

# connect to database
con = sqlite3.connect('reputation.db')

client = discord.Client() # set up bot with discord api

# Commands dict
commands = {
    "help":help
}

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!') # just a debug message to let us know bot is up and running

@client.event
async def on_message(message):

    if message.author == client.user: # bot won't reply to itself
        return
    if(not message.content.startswith(prefix)): # if the message doesn't start with the prefix, ignore
        return

    try:
        commands[message.replace(prefix,'').split(" ")[0]](message) # ugly line that runs the function corresponding to the command without the prefix
        # but only the first word in the command to ignore args
    except Exception as e:
        await message.channel.send("Command not found!")


def help(message) {
    embed=discord.Embed(title="Command list") # create an embed named "Command list"
    embed.add_field(name="..help", value="Shows this embed", inline=False) # TODO: instead of writing these out by hand, have a dict of commands
    await message.channel.send(embed=embed) # send the embed
}

client.run(TOKEN) # run the bot
