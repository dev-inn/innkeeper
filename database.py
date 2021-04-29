# database.py

import sqlite3
import rank_database
import user_database

connection = sqlite3.connect('reputation.db')
start_rankdb_with_connection(connection)
start_userdb_with_connection(connection)
