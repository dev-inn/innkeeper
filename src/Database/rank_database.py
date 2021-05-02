# rank_database.py

def addrank(self, rankid, entry_rep: int, budget: int, roleid: str):
    """
    Register a rank and role into the database.
    """
    row = self.get_rank(rankid)
    if row is not None:
        return False
    self.cursor.execute(
        "INSERT INTO ranks VALUES (?, ?, ?, ?)", (rankid, entry_rep, budget, roleid), )
    self.connection.commit()
    return True


def get_all_ranks(self):
    rows = self.cursor.execute("SELECT id,entry_rep,budget,roleid FROM ranks ORDER BY id DESC").fetchall()
    return rows


def get_rank(self, rid):
    row = self.cursor.execute("SELECT id,entry_rep,budget,roleid FROM ranks WHERE id = ?", (rid,)).fetchone()
    return row


def del_rank(self, rid):
    self.cursor.execute("DELETE FROM ranks WHERE id = ?", (rid,))
    self.connection.commit()


def get_rank_by_rep(self, rep):  # gets highest rank for given rep
    r = self.cursor.execute("SELECT id,entry_rep,budget,roleid FROM ranks WHERE entry_rep <= ? ORDER BY id DESC",
                            (rep,)).fetchone()
    return r


def nukerank(self, rankid):
    """
    Delete a rank from the database.
    """
    self.cursor.execute("DELETE FROM ranks WHERE id = ?", (rankid,), )
    self.connection.commit()
