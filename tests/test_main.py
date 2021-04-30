from src import Database
from src.Botdata import Botdata

bot = Botdata()

db = Database.DB(bot)

db.nuke_db()

database = db.cursor.execute("SELECT * FROM reputation").fetchall()
assert database is None

db.register(72)
