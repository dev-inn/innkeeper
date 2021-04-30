from src import Database
from src.Botdata import Botdata

bot = Botdata()

db = Database.DB(bot)


def test_reset_db():
    reset_db()
    database = db.cursor.execute("SELECT * FROM reputation").fetchall()
    assert len(database) == 0


def reset_db():
    db.nuke_db()
    db.start_userdb()
    db.start_rankdb()


def test_register():
    db.register(72)
    result = db.cursor.execute("SELECT value,rank,credits FROM reputation").fetchall()
    assert len(result) == 1
    entry = result[0]
    assert entry[0] == 0  # rep ==0
    assert entry[1] == 1  # rank == 1
    assert entry[2] == 1  # credits == 1
