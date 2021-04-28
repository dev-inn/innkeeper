# bot.py
import os
import discord
import sqlite3

prefix = "?"

# load secrets
TOKEN = os.environ.get("DISCORD_TOKEN")

# connect to database
con = sqlite3.connect('reputation.db')

client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):

    if message.author == client.user:
        return
    if(not message.content.startswith(prefix)):
        return

    if(message.content.startswith(prefix + "help")):
        embed=discord.Embed(title="Command list")
        embed.add_field(name="..help", value="Shows this embed", inline=False)
        await message.channel.send(embed=embed)

client.run(TOKEN)
