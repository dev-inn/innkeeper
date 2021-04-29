# scheduled_jobs.py

import schedule
import time

# local imports
import database as db
import ranks

def reload_awards():
    '''
    Reloads award budget every 6 hours
    '''

    # Reload a budget equal to user rank
    # e.g. 1 award budget per 1 rank every 6 hrs
    for rank in rank_registry:
        db.reload_awards(rank.rank, rank.budget)

###--------------------------------------------------------------------------###
### Add the Scheduler                                                        ###
###--------------------------------------------------------------------------###

def run_scheduler():
    '''
    Add scheduled jobs at the end of bot.py
    '''
    schedule.every(6).hours.do(reload_awards)

    while True:
        schedule.run_pending()
        time.sleep(1)
