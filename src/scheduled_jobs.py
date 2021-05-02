# scheduled_jobs.py

# local imports
from src import Database


def reload_awards(db: Database.DB):
    """
    Reloads award budget every 6 hours
    """

    # Reload a budget equal to user rank
    # e.g. 1 award budget per 1 rank every 6 hrs
    try:  # need this else the thread can crash
        all_ranks = db.get_all_ranks()
        for rank in all_ranks:
            print(rank.entry_rep)
            db.reload_awards(rank[0], rank[2])
    except Exception as e:
        print("Error setting budgets")
        print(e)


# -------------------------------------------------------------------------- #
#  Add the Scheduler                                                         #
# -------------------------------------------------------------------------- #


def run_scheduler(db: Database.DB):
    '''
    Add scheduled jobs at the end of bot.py
    '''

    reload_awards(db)
