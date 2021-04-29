# bot.py
import os
import sys

# local imports
import commands
import admin_commands
import scheduled_jobs as sj
from commands import *
import time

# used to check time elapsed at end of on_message
lastCheckedTime = time.time()
scheduleInterval = 6 * 60 * 60  # 6 hours x 60 mins x 60 secs gets 6 hours in seconds

with open('botdata.txt', 'r') as file:
    botdata = file.read().split(",")  # get variables from botdata.txt

prefix = botdata[0]  # set prefix to the first in there

# Avatar
pfp_path = botdata[1]

fp = open(pfp_path, 'rb')
pfp = fp.read()

# load secrets
TOKEN = os.environ.get("DISCORD_TOKEN")
if TOKEN is None:
    TOKEN = sys.argv[1]
client = discord.Client()  # set up bot with discord api


@client.event
async def on_ready():
    commands.setdiscordclient(client)  # passes client object to commands.py
    print(f'{client.user} has connected to Discord!')  # just a debug message to let us know bot is up and running
    if (client.user.avatar != pfp):
        await client.user.edit(avatar=pfp)  # adds an avatar to the bot


@client.event
async def on_message(message):
    if message.author == client.user:  # bot won't reply to itself
        return
    if (not message.content.startswith(prefix)):  # if the message doesn't start with the prefix, ignore
        return

    command = message.content.replace(prefix, '').split(" ")[
        0]  # get the command by getting the message minus the prefix and then getting the first word
    if (command == ''):  # if theres nothing but the prefix, ignore
        return
    if command in command_registry:  # if the command exists, run it
        await command_registry[command].invoke(message)
    elif command in hidden_command_registry:  # if the command exists, run it
        await hidden_command_registry[command].invoke(message)
    elif command in admin_commands.admin_command_registry:  # if the command exists, run it
        # TODO: verify permissions, or check if we are in debug mode
        await admin_commands.admin_command_registry[command].invoke(message)
    else:
        await message.channel.send('Oops, I don\'t recognize that command')

    # i dont like this but its the easiest way to have a non blocking scheduled event that runs repeatedly
    if lastCheckedTime + scheduleInterval < time.time():
        sj.run_scheduler()
        global lastCheckedTime
        lastCheckedTime = time.time() - ((
                    time.time() - lastCheckedTime) - scheduleInterval)  # sets last checked time to when it should have been activated to account for the fact messages arent constantly sent


client.run(TOKEN)  # run the bot
