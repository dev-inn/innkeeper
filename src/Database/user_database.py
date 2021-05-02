# user_database.py


def disconnectDB():
    return


def exists(self, userID: int) -> bool:
    """
    Returns true if a user is registered in the database.
    """
    rows = self.cursor.execute(
        "SELECT value FROM reputation WHERE id = ?", (userID,), ).fetchall()
    return len(rows) > 0


def getCredits(self, userID: int) -> int:
    """
    Returns the users award credits.
    """
    if not self.exists(userID):
        self.register(userID)
        return 1
    rows = self.cursor.execute(
        "SELECT credits FROM reputation WHERE id = ?", (userID,), ).fetchall()
    if not rows:
        return 0
    return rows[0][0]


def setCredits(self, userID: int, amt: int):
    """
        Sets the users award credits.
    """
    if not self.exists(userID):
        self.register(userID)
    self.cursor.execute("UPDATE reputation SET credits = ? WHERE id = ?", (amt, userID))
    self.connection.commit()


def subtractCredits(self, userID: int, quantity: int = 1):
    """
    Removes one award credit.
    """
    self.cursor.execute("UPDATE reputation SET credits = ? WHERE id = ?",
                        (self.get_credits(userID) - quantity, userID))
    self.connection.commit()


def register(self, userID: int):
    """
    Register a user into the database with a reputation of 0.
    """
    base_rank = self.get_rank_by_rep(0)
    if base_rank is None:
        base_rank = [0]
    self.cursor.execute(
        "INSERT INTO reputation VALUES (?, ?, ?, ?)", (userID, 0, base_rank[0], 1), )
    self.connection.commit()


def getReputation(self, userID: int) -> int:
    """
    Return user score
    """
    rows = self.cursor.execute(
        "SELECT value FROM reputation WHERE id = ?", (userID,), ).fetchall()
    if not rows:
        return 0
    return rows[0][0]


def award(self, fromUserID: int, toUserID: int, quantity: int = 1):
    """
    increment user score by one. Return new user score
    """
    if not self.exists(fromUserID):
        self.register(fromUserID)
    if not self.exists(toUserID):
        self.register(toUserID)

    self.subtract_credits(fromUserID, quantity)
    reputation = self.get_reputation(toUserID)
    self.cursor.execute("UPDATE reputation SET value = ? WHERE id = ?",
                        (reputation + quantity, toUserID))
    self.connection.commit()
    return reputation + quantity


def set_rank(self, userID: int, rank: int):
    '''
    Set a user's new rank
    '''
    if not self.exists(userID):
        self.register(userID)

    self.cursor.execute("UPDATE reputation SET rank = ? WHERE id = ?",
                        (rank, userID))
    self.connection.commit()


def get_user_rank(self, userID: int) -> int:
    """
    Return user rank
    """
    rows = self.cursor.execute(
        "SELECT rank FROM reputation WHERE id = ?", (userID,), ).fetchall()
    if not rows:
        return 1
    return rows[0][0]


def reload_awards(self, rankID: int, quantity: int):
    """
    increment user score by one. Return new user score
    """
    self.cursor.execute("UPDATE reputation SET credits = ? WHERE rank = ?",
                        (quantity, rankID))
    self.connection.commit()


def leaderboard(self):
    """
    Return top 10 rows' id and value fields
    """
    rows = self.cursor.execute("SELECT id,value,rank FROM reputation ORDER BY value DESC LIMIT 10").fetchall()
    return rows


def nuke(self, userID: int):
    """
    Delete user from database.
    """

    # TODO: consider storing in a `recently_deleted`
    # table so an admin may restore the change

    if self.exists(userID):
        self.cursor.execute("DELETE FROM reputation WHERE id = ?", (userID,), )
        self.connection.commit()
