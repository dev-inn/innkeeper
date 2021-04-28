# bot.py
import os
import discord
import sqlite3

# load secrets
TOKEN = os.environ.get("DISCORD_TOKEN")

# connect to database
con = sqlite3.connect('reputation.db')

client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

client.run(TOKEN)
