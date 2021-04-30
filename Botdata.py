# Botdata.py

import configparser

# default values to populate the config file the first time
default_values = {'debug': 'False', 'prefix': '?', 'pfp': 'avatar.jpg',
                  'gh_link': 'https://github.com/dev-inn/innkeeper', 'token': '<PUT_YOUR_TOKEN_HERE>',
                  'schedulerInterval': '21600', 'dbfile': 'reputation'}
filepath = 'innkeeperbot.cfg'  # where config data is stored


class Botdata:

    def __init__(self):
        self.config = configparser.ConfigParser()
        self.config.read(filepath)
        self.validate_values()

    def validate_values(self):  # if any key,value pair does not exist it is created
        if 'DEFAULT' not in self.config:
            self.config['DEFAULT'] = default_values
            print("Config file created")
            print("Fill in your discord bot api token")
            raise SystemExit
        print(default_values)
        for key in default_values:
            if not key in self.config['DEFAULT']:
                self.config['DEFAULT'][key] = default_values[key]
        self.save()

    def get_is_debug(self) -> bool:
        return self.config['DEFAULT']['debug'].lower() == "true"  # .lower() so that True, true, tRuE etc all work

    def get(self, key) -> str or bool:
        if key == "debug":
            return self.get_is_debug()
        return self.config['DEFAULT'][key]

    def set(self, key: str, value: str):
        self.config['DEFAULT'][key] = value
        self.save()

    def save(self):
        with open(filepath, 'w') as configfile:
            self.config.write(configfile)
