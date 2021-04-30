# scheduled_jobs.py

# local imports
from src import Database
from src import ranks


def reload_awards(db: Database.DB):
    '''
    Reloads award budget every 6 hours
    '''

    # Reload a budget equal to user rank
    # e.g. 1 award budget per 1 rank every 6 hrs
    try:  # need this else the thread can crash
        for rankName in ranks.rank_registry:
            rank = ranks.rank_registry[rankName]
            print(rank.entry_rep)
            db.reload_awards(rank.rank, rank.budget)
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
