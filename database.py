# database.py

import sqlite3

connection = sqlite3.connect('reputation.db')

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

print(table_string)

cursor = connection.cursor()
cursor.execute(
    "CREATE TABLE IF NOT EXISTS reputation " + table_string)

columns = [i[1] for i in cursor.execute('PRAGMA table_info(reputation)')]
if columns != [name for name, _ in table_types.items()]:
    cursor.execute('DROP TABLE reputation')
    cursor.execute(
        "CREATE TABLE reputation " + table_string)


def disconnectDB():
    return


def exists(userID):
    '''
    Returns true if a user is registered in the database.
    '''
    rows = cursor.execute(
        "SELECT value FROM reputation WHERE id = ?", (userID,),).fetchall()
    return len(rows) > 0


def getCredits(userID):
    '''
    Returns the users award credits.
    '''
    if not exists(userID):
        register(userID)
        return 1
    rows = cursor.execute(
        "SELECT credits FROM reputation WHERE id = ?", (userID,),).fetchall()
    if not rows:
        return 0
    return rows[0][0]


def setCredits(userID, amt):
    '''
        Sets the users award credits.
    '''
    if not exists(userID):
        register(userID)
    cursor.execute("UPDATE reputation SET credits = ? WHERE id = ?", (amt, userID))
    connection.commit()


def subtractCredits(userID, quantity=1):
    '''
    Removes one award credit.
    '''
    cursor.execute("UPDATE reputation SET credits = ? WHERE id = ?",
                   (getCredits(userID) - quantity, userID))


def register(userID):
    '''
    Register a user into the database with a reputation of 0.
    '''
    cursor.execute(
        "INSERT INTO reputation VALUES (?, ?, ?, ?)", (userID, 0, 1, 1), )
    connection.commit()


def getReputation(userID):
    '''
    Return user score
    '''
    rows = cursor.execute(
        "SELECT value FROM reputation WHERE id = ?", (userID,), ).fetchall()
    if not rows:
        return 0
    return rows[0][0]


def award(fromUserID, toUserID, quantity=1):
    '''
    increment user score by one. Return new user score
    '''
    if not exists(fromUserID):
        register(fromUserID)
    if not exists(toUserID):
        register(toUserID)

    subtractCredits(fromUserID, quantity)
    reputation = getReputation(toUserID)
    cursor.execute("UPDATE reputation SET value = ? WHERE id = ?",
                   (reputation + quantity, toUserID))
    connection.commit()
    return reputation + quantity


def reload_awards(rankID, quantity):
    '''
    increment user score by one. Return new user score
    '''
    cursor.execute("UPDATE reputation SET credits = ? WHERE rank = ?",
                   (quantity, rankID))
    connection.commit()


def leaderboard():
    '''
    Return top 10 rows' id and value fields
    '''
    rows = cursor.execute("SELECT id,value FROM reputation ORDER BY value DESC LIMIT 10").fetchall()
    return rows


def nuke(userID):
    '''
    Delete user from database.
    '''

    # TODO: consider storing in a `recently_deleted`
    # table so an admin may restore the change

    if exists(userID):
        cursor.execute("DELETE FROM reputation WHERE id = ?", (userID,),)
        connection.commit()
