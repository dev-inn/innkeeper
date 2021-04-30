class Command:
    def __init__(self, name, args, description, function, shorthand=None):
        self.name = name
        self.shorthand = shorthand
        self.args = args
        if args is None:
            self.args = ''
        self.description = description
        self.function = function

    async def invoke(self, message):
        await self.function(message)
