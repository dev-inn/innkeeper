# database.py

import sqlite3
import rank_database as rdb
import user_database as udb

connection = sqlite3.connect('reputation.db')
rdb.start_rankdb_with_connection(connection)
udb.start_userdb_with_connection(connection)

from rank_database import *
from user_database import *
