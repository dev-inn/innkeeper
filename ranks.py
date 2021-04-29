# ranks.py

rank_registry = {}

class Rank:
    def __init__(self, rank, entry_rep, budget, role):
        '''
        rank      - integer
        entry_rep - integer, reputation needed to qualify for rank
        budget    - integer, award budget for rank members
        budget    - discord.Role, role for rank members
        '''
        self.rank = rank
        self.entry_rep = entry_rep
        self.budget = budget
        self.role = role

    def register(self, registry=rank_registry):
        if self.rank in registry:
            print('WARNING: rank ' + self.rank
                  + 'is already registered. Overwriting.')
        registry[self.name] = self

    def assign_rank(userID):
        return

###--------------------------------------------------------------------------###
### Register Ranks                                                           ###
###--------------------------------------------------------------------------###

Rank(1, 0, 1, None)
