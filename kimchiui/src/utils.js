import IconService from 'icon-sdk-js'
const { IconAmount, IconConverter} = IconService


function toSend(amount, contract){
    if (contract === "icx" || contract === "None"){
        return  IconAmount.of(amount, IconAmount.Unit.ICX).toLoop()
        }
  
    return  amount*(10**decimals[contract])

}

function toReadable(amount, contract){
    if (contract === "icx" || contract === "None"){
        return  parseInt(amount)/(10**18)
        }
  
    return  parseInt(amount)/(10**decimals[contract])
        

}
const Tokens = {
    "cx0f2c813f9155562fc5bc7f013a616000b74e4834":"ST",
    "cxa1f2549d54261cf43e8c113705028613f90433ed" : "T1",
    "icx":"ICX",
    "None":"ICX"

}
const decimals = {
    "cxa1f2549d54261cf43e8c113705028613f90433ed":15,
    "cx0f2c813f9155562fc5bc7f013a616000b74e4834":18,

}
const Contracts = [
    {
        ticker: "ICX",
        contract: "icx"
    },
    
    {
        ticker: "T1",
        contract: "cxa1f2549d54261cf43e8c113705028613f90433ed"
    },
    {
        ticker: "ST",
        contract: "cx0f2c813f9155562fc5bc7f013a616000b74e4834"
    }
]
export {toReadable, toSend, Contracts, Tokens}