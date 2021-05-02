import sqlite3

from src.Botdata import Botdata
from src.Database import user_database
from src.Database import rank_database


class DB:

    def close(self):
        self.connection.commit()
        self.connection.close()

    def __init__(self, botdata: Botdata, sid: str):
        self.botdata = botdata
        self.connection = sqlite3.connect(botdata.get('dbdir') + '/' + sid + '.db')
        self.cursor = self.connection.cursor()
        self.start_rankdb()
        self.start_userdb()
        self.server_id = sid

    def start_rankdb(self):
        table_types = {
            'id': 'INTEGER',
            'entry_rep': 'INTEGER',
            'budget': 'INTEGER',
        }

        # create the sqlite table string
        table_string = '('
        for col, type in table_types.items():
            table_string += col + ' ' + type + ','

        table_string = table_string[:len(table_string) - 1]
        table_string += ')'

        self.cursor.execute(
            "CREATE TABLE IF NOT EXISTS roles " + table_string)

        columns = [i[1] for i in self.cursor.execute('PRAGMA table_info(roles)')]
        if columns != [name for name, _ in table_types.items()]:
            self.cursor.execute('DROP TABLE roles')
            self.cursor.execute(
                "CREATE TABLE roles " + table_string)

    def start_userdb(self):
        table_types = {
            'id': 'INTEGER',
            'value': 'INTEGER',
            'rank': 'INTEGER',
            'credits': 'INTEGER',
        }

        # create the sqlite table string
        table_string = '('
        for col, type in table_types.items():
            table_string += col + ' ' + type + ','

        table_string = table_string[:len(table_string) - 1]
        table_string += ')'

        self.cursor.execute(
            "CREATE TABLE IF NOT EXISTS reputation " + table_string)

        columns = [i[1] for i in self.cursor.execute('PRAGMA table_info(reputation)')]
        if columns != [name for name, _ in table_types.items()]:
            self.cursor.execute('DROP TABLE reputation')
            self.cursor.execute(
                "CREATE TABLE reputation " + table_string)

    def nuke_db(self):
        self.cursor.execute('DROP TABLE reputation')
        self.cursor.execute('DROP TABLE roles')

    # -------------------------------------------------------------------------- #
    #  Rank DB funcs                                                             #
    # -------------------------------------------------------------------------- #

    addrank = rank_database.addrank

    nukerank = rank_database.nukerank

    # -------------------------------------------------------------------------- #
    #  User DB funcs                                                             #
    # -------------------------------------------------------------------------- #

    get_credits = user_database.getCredits

    set_credits = user_database.setCredits

    exists = user_database.exists

    register = user_database.register

    subtract_credits = user_database.subtractCredits

    get_reputation = user_database.getReputation

    award = user_database.award

    get_rank = user_database.get_rank

    set_rank = user_database.set_rank

    reload_awards = user_database.reload_awards

    leaderboard = user_database.leaderboard

    nuke = user_database.nuke
