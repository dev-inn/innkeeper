
command_registry = { }

class Command:
    def __init__(name, description, function):
        self.name = name
        self.description = description
        self.function = function

    def register(registry=command_registry):
        if command_registry[name]:
            print('WARNING: ' + name + 'is already registered. Overwriting.')
        command_registry[name] = self

    def invoke(message):
        self.function(message)

###--------------------------------------------------------------------------###
### Command Implementations                                                  ###
###--------------------------------------------------------------------------###

async def help(message):
    '''
    Creates and sends a discord embed with a list of all command names and
    descriptions avalable in the command_registry.
    '''
    embed=discord.Embed(title="Command list")
    for cmd in command_registry:
        embed.add_field(name=cmd.name, value=cmd.description, inline=False)
    await message.channel.send(embed=embed)

Command('help', 'Shows a list of available commands', help).register()
