# bot.py

# local imports
import discord

from Commands import admincommands, commands  # imports the files, the classes are instansiated later
import scheduled_jobs as sj
import time
import Database
from Botdata import Botdata

bot = Botdata()

print(bot.get_is_debug())

if __name__ == "__main__":
    # used to check time elapsed at end of on_message
    lastCheckedTime = time.time()

    # Avatar
    pfp_path = bot.get('pfp')

    fp = open(pfp_path, 'rb')
    pfp = fp.read()

    # load secrets
    TOKEN = bot.get('token')

    client = discord.Client()  # set up bot with discord api

    db = Database.DB()

    cmds = commands.Commands(client, bot, db)
    a_cmds = admincommands.AdminCommands(client, bot, db)


def set_last_checked_time(t):
    global lastCheckedTime
    lastCheckedTime = t


@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')  # just a debug message to let us know bot is up and running
    if client.user.avatar != pfp:
        await client.user.edit(avatar=pfp)  # adds an avatar to the bot


@client.event
async def on_message(message):
    if message.author == client.user:  # bot won't reply to itself
        return
    if not message.content.startswith(bot.get('prefix')):  # if the message doesn't start with the prefix, ignore
        return

    command = message.content.replace(bot.get('prefix'), '').split(" ")[
        0]  # get the command by getting the message minus the prefix and then getting the first word
    command = command.lower()

    if command == '':  # if theres nothing but the prefix, ignore
        return

    if cmds.exists(command):  # if the command exists, run it
        await cmds.get_command(command).invoke(message)
    elif a_cmds.exists(command):  # if the command exists, run it
        # TODO: verify permissions, or check if we are in debug mode
        await a_cmds.get_command(command).invoke(message)

    else:
        await message.channel.send('Oops, I don\'t recognize that command')

    # i dont like this but its the easiest way to have a non blocking scheduled event that runs repeatedly
    schedule_interval = int(bot.get('schedulerInterval'))
    if lastCheckedTime + schedule_interval < time.time():
        sj.run_scheduler(db)

        # sets last checked time to when it should have been activated to
        # account for the fact messages aren't constantly sent
        set_last_checked_time(time.time() - ((
                                                     time.time() - lastCheckedTime) - schedule_interval))


client.run(TOKEN)  # run the bot
