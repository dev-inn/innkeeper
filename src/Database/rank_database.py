# rank_database.py

def addrank(self, roleID, entry_rep: int, budget: int):
    """
    Register a rank and role into the database.
    """
    self.cursor.execute(
        "INSERT INTO roles VALUES (?, ?, ?)", (roleID, entry_rep, budget), )
    self.connection.commit()


def nukerank(self, roleID):
    """
    Delete a rank from the database.
    """
    self.cursor.execute("DELETE FROM roles WHERE id = ?", (roleID,), )
    self.connection.commit()
