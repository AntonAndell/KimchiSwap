from iconservice import *
TAG = 'KimchiSwap'


class IRC2Interface(InterfaceScore):
    """ An interface of ICON Token Standard, IRC-2"""
    @interface
    def name(self) -> str:
        pass

    @interface
    def symbol(self) -> str:
        pass

    @interface
    def decimals(self) -> int:
        pass

    @interface
    def totalSupply(self) -> int:
        pass

    @interface
    def balanceOf(self, _owner: Address) -> int:
        pass

    @interface
    def transfer(self, _to: Address, _value: int, _data: bytes = None):
        pass


class KimchiSwap(IconScoreBase):

    def __init__(self, db: IconScoreDatabase) -> None:
        super().__init__(db)
        self._db = db
        self.swap_data = DictDB('Swaps', db, value_type=str,depth=2)
        self.swap_address = DictDB('swapAddress', db, value_type=Address,depth=2)
        self.swap_head = VarDB("swapHead", db, value_type=str)
        self.next_id = VarDB("next_id", db, value_type=int)
      
        
    def on_install(self) -> None:
        super().on_install()
        

    def on_update(self) -> None:
        super().on_update()
    
    
    @external(readonly=True)
    def find(self) -> str:

        id = self.swap_head.get()
        resp = []
        while id != "":
            item = {"id":id}
            #revert(f'{self.swap_data[id]["takerAmount"]}')
            item["takerAmount"]    = f'{self.swap_data[id]["takerAmount"]}'
            item["makerContract"]  = f'{self.swap_address[id]["makerContract"]}'
            item["takerContract"]  = f'{self.swap_address[id]["takerContract"]}'
            item["makerAmount"]    = f'{self.swap_data[id]["makerAmount"]}'
            item["maker"]          = f'{self.swap_address[id]["maker"]}'
   
            resp.append(item)
            id = self.swap_data[id]["prev"]
            
        return json_dumps(resp)


    @external(readonly=False)
    def cancel_swap(self, id:str):
        if self.swap_address[id]["maker"] != self.msg.sender:
           revert("swap is not owned by this address or does not exist")
        self.send(self.msg.sender, int(self.swap_data[id]["makerAmount"]), self.swap_address[id]["makerContract"])
        self.remove_swap(id)

    def remove_swap(self, id):
        
        prev=self.swap_data[id]["prev"]
        next=self.swap_data[id]["next"]
        if prev != "":
            self.swap_data[prev]["next"]=next
        if next == str(self.next_id.get()):
            self.swap_head.set(prev)
        self.swap_data[next]["prev"] = prev

        self.swap_address[id].remove("makerContract")
        self.swap_address[id].remove("takerContract")
        self.swap_address[id].remove("maker")
        self.swap_data[id].remove("prev")
        self.swap_data[id].remove("next")
        self.swap_data[id].remove("takerAmount")
        self.swap_data[id].remove("makerAmount")


    @payable
    @external(readonly=False)
    def create_swap(self, takerContract:str, takerAmount: str,):
        id = str(self.next_id.get())
        self.swap_data[id]["prev"] = self.swap_head.get()
        self.next_id.set(self.next_id.get()+1)
        self.swap_head.set(id)

        self.swap_data[id]["next"]             = str(self.next_id.get())
        self.swap_data[id]["makerAmount"]      = str(self.msg.value)
        self.swap_data[id]["takerAmount"]      = takerAmount
        self.swap_address[id]["takerContract"] = Address.from_string(takerContract)
        self.swap_address[id]["maker"]         = self.msg.sender  


    def create_swap_irc2(self, makerContract:Address,  makerAmount: str ,takerContract:str, takerAmount: str,  _from:Address):

        id = str(self.next_id.get())
        self.swap_data[id]["prev"] = self.swap_head.get()
        self.next_id.set(self.next_id.get()+1)
        self.swap_head.set(id)

        self.swap_data[id]["next"]             = str(self.next_id.get())
        self.swap_data[id]["makerAmount"]      = makerAmount
        self.swap_data[id]["takerAmount"]      = takerAmount
        self.swap_address[id]["makerContract"] = makerContract
        if takerContract != "None" and takerContract != "icx": 
            self.swap_address[id]["takerContract"] =  Address.from_string(takerContract)
        self.swap_address[id]["maker"]         = _from

        
    @payable
    @external(readonly=False)
    def fill_swap(self, id:str, _value:int = 0, _from:Address = None, contract:Address= None):
        if _value == 0 and _from == None:
            _value = self.msg.value
            _from = self.msg.sender
        
        if str(_value) != self.swap_data[id]["takerAmount"]:
            revert(f'Not enough Tokens to fill this swap {_value} != {self.swap_data[id]["takerAmount"]}')
        
        if self.swap_address[id]["takerContract"] != contract:
            revert("invalid tokentype for this swap")
    
        self.send(self.swap_address[id]["maker"], _value, contract)
        self.send(_from, int(self.swap_data[id]["makerAmount"]),  self.swap_address[id]["makerContract"])
        self.remove_swap(id)
    
    def send(self, to:Address, value:int, contract:Address):
        
        if contract == None:
            self.icx.send(to, value)
            return
        token_score = self.create_interface_score(contract, IRC2Interface)
        token_score.transfer(to, value)

    @external
    def tokenFallback(self, _from: Address, _value: int, _data: bytes) -> None:
        if _data is None or _data == b'None':
            revert("missing call parameters")
        params = json_loads(_data.decode('utf-8'))
        if params['type'] == 'create_swap':
            self.create_swap_irc2(self.msg.sender, str(_value), params["takerContract"], params["takerAmount"], _from)
        elif params["type"] == 'fill_swap':
            self.fill_swap( params["id"], _value, _from, self.msg.sender)
        else:
            revert("missing call type")
    
    @payable
    def fallback(self):
        Logger.info('fallback is called', TAG)

#ICX 