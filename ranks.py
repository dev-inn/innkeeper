# ranks.py

rank_registry = {}


class Rank:
    def __init__(self, rank, entry_rep, budget, name, role):
        '''
        rank      - integer
        entry_rep - integer, reputation needed to qualify for rank
        budget    - integer, award budget for rank members - added to credits every 6 hours
        role      - discord.Role, role for rank members
        '''
        self.rank = rank
        self.entry_rep = entry_rep
        self.budget = budget
        self.role = role
        self.name = name

    def register(self, registry=rank_registry):
        if self.rank in registry:
            print('WARNING: rank ' + self.rank
                  + 'is already registered. Overwriting.')
        registry[self.name] = self

    @staticmethod
    def assign_rank(userID):
        return

    @staticmethod
    def getRankForRep(rep):
        for rank in rank_registry:  # sorry this is just a brute force search
            if rank.entry_rep <= rep:
                return rank


###--------------------------------------------------------------------------###
### Register Ranks                                                           ###
###--------------------------------------------------------------------------###

Rank(1, 0, 1, "Beginner", None).register(rank_registry)
Rank(2, 10, 2, "Script Kiddy", None).register(rank_registry)
Rank(3, 25, 5, "Apprentice Junior Dev", None).register(rank_registry)
Rank(4, 50, 10, "Junior Dev", None).register(rank_registry)
Rank(5, 100, 20, "Apprentice Senior Dev", None).register(rank_registry)
Rank(6, 500, 100, "Senior Dev", None).register(rank_registry)
Rank(7, 1000, 200, "Software Architect", None).register(rank_registry)
Rank(8, 5000, 1000, "Senior Lead Software Engineer", None).register(rank_registry)
