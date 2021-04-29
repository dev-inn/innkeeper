# database.py

import sqlite3

connection = sqlite3.connect("reputation.db")
cursor = connection.cursor()
#cursor.execute("CREATE TABLE reputation (id INTEGER, value INTEGER)")

def disconnectDB():
    connection = sqlite3.connect("reputation.db")

def exists(userID):
    '''
    Returns true if a user is registered in the database.
    '''
    rows = cursor.execute(
        "SELECT value FROM reputation WHERE id = ?", (userID,),).fetchall()
    return len(rows) > 0

def register(userID):
    '''
    Register a user into the database with a reputation of 0.
    '''
    cursor.execute("INSERT INTO reputation VALUES (?, ?)", (userID, 0,),)

def getReputation(userID):
    '''
    Return user score
    '''
    rows = cursor.execute(
        "SELECT value FROM reputation WHERE id = ?", (userID,),).fetchall()
    if not rows:
        return 0
    return rows[0][0]

def award(userID):
    '''
    increment user score by one. Return new user score
    '''
    if not exists(userID):
        register(userID)
    reputation = getReputation(userID)
    cursor.execute("UPDATE reputation SET value = ? WHERE id = ?",
        (reputation + 1, userID))
    return 0