# database.py

import sqlite3
from rank_database import *
from user_database import *


connection = sqlite3.connect('reputation.db')
start_rankdb_with_connection(connection)
start_userdb_with_connection(connection)
