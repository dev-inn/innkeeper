# scheduled_jobs.py

import schedule
import time

# local imports
import database as db

def reload_awards():
    '''
    Reloads award budget every 6 hours
    '''
    ranks = [1, 2, 3, 4, 5] # TODO: hook into ranks system

    # Reload a budget equal to user rank
    # e.g. 1 award budget per 1 rank every 6 hrs
    for i in ranks:
        db.reload_awards(i, i)

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
