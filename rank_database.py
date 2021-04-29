# rank_database.py

import sqlite3

global connection
global cursor

def start_rankdb_with_connection(cn):
    global connection
    global cursor
    connection = cn
    cursor = connection.cursor()

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

    cursor.execute(
        "CREATE TABLE IF NOT EXISTS roles " + table_string)

    columns = [i[1] for i in cursor.execute('PRAGMA table_info(roles)')]
    if columns != [name for name, _ in table_types.items()]:
        cursor.execute('DROP TABLE roles')
        cursor.execute(
            "CREATE TABLE roles " + table_string)

def addrank(roleID, entry_rep, budget):
    '''
    Register a rank and role into the database.
    '''
    cursor.execute(
        "INSERT INTO roles VALUES (?, ?, ?)", (roleID, entry_rep, budget),)
    connection.commit()

def nukerank(roleID):
    '''
    Delete a rank from the database.
    '''
    cursor.execute("DELETE FROM roles WHERE id = ?", (roleID,),)
    connection.commit()
