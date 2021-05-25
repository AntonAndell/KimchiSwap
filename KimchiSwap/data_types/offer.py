
from iconservice import *


class LinkedObject:

    _NAME = 'LinkedObject'

    def __init__(self, _id:str, db: IconScoreDatabase ,prev=None ):

        self.ID = VarDB(f'{_id}_ID', db , value_type=str)
        if prev != None:
            self.ID.set(prev)


    def get(self) -> str:
        return self.ID.get()

    
    