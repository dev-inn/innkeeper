# bot.py

import time

# local imports
import discord

from src import Database
from src import scheduled_jobs as sj
from src.Botdata import Botdata
from src.Commands import admincommands  # imports the files, the classes are instansiated later
from src.Commands import commands

bot = Botdata()

print(bot.get_is_debug())

# used to check time elapsed at end of on_message
lastCheckedTime = time.time()

# Avatar
pfp_path = bot.get('pfp')

fp = open(pfp_path, 'rb')
pfp = fp.read()

# Custom Status
activityvar = discord.Activity(type=discord.ActivityType.custom,state="Coding Ultron")


# load secrets
TOKEN = bot.get('token')

client = discord.Client()  # set up bot with discord api
server_db_id_list = []
server_db_dict = {}

cmds = commands.Commands(client, bot)
a_cmds = admincommands.AdminCommands(client, bot)


def set_last_checked_time(t):
    global lastCheckedTime
    lastCheckedTime = t


@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')  # just a debug message to let us know bot is up and running
    await bot.change_presence(activity=activityvar)
    try:
        if client.user.avatar != pfp:
            await client.user.edit(avatar=pfp)  # adds an avatar to the bot
    except discord.HTTPException:
        pass


@client.event
async def on_message(message):
    sid = message.channel.guild.id  # server id
    # if server not cached
    if sid not in server_db_id_list:
        server_db_id_list.append(sid)
        if len(server_db_id_list) > int(bot.get('server_cache_limit')):
            server_db_dict[server_db_id_list[0]].close()
            server_db_dict.pop(server_db_id_list[0])
            server_db_id_list.pop(0)
        server_db_dict[sid] = Database.DB(bot, str(sid))

    db = server_db_dict[sid]

    if message.author == client.user:  # bot won't reply to itself
        return
    if not message.content.startswith(bot.get('prefix')):  # if the message doesn't start with the prefix, ignore
        return

    command = message.content.replace(bot.get('prefix'), '').split(" ")[
        0]  # get the command by getting the message minus the prefix and then getting the first word
    command = command.lower()

    if command == '':  # if theres nothing but the prefix, ignore
        return

    if not db.exists(message.author.id):
        db.register(message.author.id)
    for user in message.mentions:
        if not db.exists(user.id):
            db.register(user.id)

    if cmds.exists(command):  # if the command exists, run it
        await cmds.get_command(command).invoke(message, db)

    elif a_cmds.exists(command):  # if the command exists and is an admin command
        # check if user has one of the admin roles
        for role in message.author.roles:
            if str(role.id) == bot.get('controller-role') or role.permissions.administrator:
                await a_cmds.get_command(command).invoke(message, db)
                break
        else:
            await message.channel.send("Sorry, only an admin can use that command")
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
