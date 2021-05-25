import IconService, {IconAmount, IconConverter } from 'icon-sdk-js'


const ScoreAdress = "cxff90696bd8a555fdbc09e4883f3c964b073ddd2b"



// ================================================
//  API Implementation
// ================================================
class API {
    constructor(scoreAddress) {
        

        this._nid =  IconConverter.toBigNumber('3')
        this._scoreAddress = scoreAddress
        this.network = "https://bicon.net.solidwallet.io/api/v3"
    }

   

    getSwaps() {
        return this.__call(this._scoreAddress, 'find', {})
    }
    


    swap(walletAddress, Id, taker_contract, taker_amount) {
        console.log("----- ", taker_amount)
        if (taker_contract === "icx" || taker_contract === "None" ) {
            const value = taker_amount;
            return this.__iconexCallTransaction(
                walletAddress,
                this._scoreAddress,
                'fill_swap',
                value, {id: Id }
            )
        } else {
            const value = "0x"+ parseInt(taker_amount).toString(16)
            const data = {
                'type': 'fill_swap',
                'id': Id
            }
            console.log("---fill", value)
            return this.__iconexCallTransaction(walletAddress, taker_contract, 'transfer', 0, {
                '_to': this._scoreAddress,
                '_value': value,
                '_data': IconConverter.toHex(JSON.stringify(data))
            })
        }
    }
   
    

    cancelSwap(walletAddress, Id) {
        return this.__iconexCallTransaction(walletAddress, this._scoreAddress, 'cancel_swap', 0, {
            id: Id
        })
    }

    createSwap(walletAddress, maker_contract, maker_amount, taker_contract, taker_amount) {

        if (maker_contract === "icx" || maker_contract === "None") {
            let params = {
                takerContract: taker_contract,
                takerAmount: taker_amount.toString(),
            }
            console.log(params)
       
            return this.__iconexCallTransaction(walletAddress, this._scoreAddress, 'create_swap',maker_amount, params)
        } else {
            console.log(taker_amount)
            let data = {
                'type': 'create_swap',
                'takerContract': taker_contract,
                'takerAmount': taker_amount.toString(),
            }
            const params = {
                '_to': this._scoreAddress,
                '_value': IconConverter.toHex(maker_amount),
                '_data': IconConverter.fromUtf8(JSON.stringify(data))
            }
            return this.__iconexCallTransaction(walletAddress, maker_contract, 'transfer', 0, params)
        }
    }

   


    // IRC2 Token Interface ============================================================
    tokenName(contract) {
        return this.__call(contract, 'name')
    }
    tokenSymbol(contract) {
        return this.__call(contract, 'symbol')
    }
    tokenDecimals(contract) {
        return this.__call(contract, 'decimals')
    }

    // ICONex Connect Extension =============================================================
    iconexHasAccount() {
        return this.__iconexConnectRequest('REQUEST_HAS_ACCOUNT')
    }

    iconexHasAddress(address) {
        return this.__iconexConnectRequest('REQUEST_HAS_ADDRESS', address)
    }

    iconexAskAddress() {
        return this.__iconexConnectRequest('REQUEST_ADDRESS')
    }

    // ======================================================================================
    // Following classes are private because they are lower level methods at a protocol level
    __iconexCallTransactionEx(from, to, method, value, stepLimit, params) {
        const transaction = this.__icxCallTransactionBuild(from, to, method, value, stepLimit, params)
        const jsonRpcQuery = {
            jsonrpc: '2.0',
            method: 'icx_sendTransaction',
            params: IconConverter.toRawTransaction(transaction),
            id: 1234
        }
        return this.__iconexJsonRpc(jsonRpcQuery)
    }

    __iconexCallTransaction(from, to, method, value, params) {
        return this.__iconexCallTransactionEx(from, to, method, value, IconConverter.toBigNumber('2000000'), params)
    }

    __iconexConnectRequest(requestType, payload) {
        return new Promise((resolve, reject) => {
            function eventHandler(event) {
                const { payload } = event.detail
                window.removeEventListener('ICONEX_RELAY_RESPONSE', eventHandler)
                resolve(payload)
            }
            window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler)

            window.dispatchEvent(new window.CustomEvent('ICONEX_RELAY_REQUEST', {
                detail: {
                    type: requestType,
                    payload
                }
            }))
        })
    }

    __iconexIcxTransaction(from, to, value) {
        const transaction = this.__icxTransactionBuild(from, to, value, 100000)
        const jsonRpcQuery = {
            jsonrpc: '2.0',
            method: 'icx_sendTransaction',
            params: IconConverter.toRawTransaction(transaction),
            id: 1234
        }
        return this.__iconexJsonRpc(jsonRpcQuery)
    }

    __iconexJsonRpc(jsonRpcQuery) {
        return this.__iconexConnectRequest('REQUEST_JSON-RPC', jsonRpcQuery)
    }

    // ======================================================================================
    __getIcxBalance(address) {
        return this._getIconService().getBalance(address).execute()
    }

    __getIRC2Balance(address, contract) {
        return this.__call(contract, 'balanceOf', { '_owner': address })
    }



    __call(to, method, params = {}) {
        return new Promise((resolve, reject) => {
            try {
                let callBuilder = new IconService.IconBuilder.CallBuilder()
                    .from(null)
                    .to(to)
                    .method(method)

                // Optional "params" field
                if (Object.keys(params).length !== 0) {
                    callBuilder = callBuilder.params(params)
                }

                const call = callBuilder.build()
                const result = this._getIconService().call(call).execute()
                resolve(result)
            } catch (err) {
                reject(err)
            }
        })
    }

    _getIconService() {
        return new IconService(new IconService.HttpProvider(this.network))
    }

    __estimateCallStep(from, to, method, value, params = {}) {
        const transaction = {
            "jsonrpc": "2.0",
            "method": "debug_estimateStep",
            "id": 1,
            "params": {
                "version": "0x3",
                "from": from,
                "to": to,
                "value": value,
                "timestamp": IconConverter.toHex((new Date()).getTime() * 1000),
                "nid": IconConverter.toHex(IconConverter.toBigNumber(this._nid)),
                "nonce": "0x1",
                "dataType": "call",
                "data": {
                    "method": method,
                    "params": params
                }
            }
        }

        return new Promise((resolve, reject) => {
            try {
                const result = this._getDebugIconService().provider.request(transaction).execute()
                resolve(result)
            } catch (err) {
                reject(err)
            }
        })
    }

    __icxCallTransactionBuild(from, to, method, value, stepLimit, params = {}) {
        let callTransactionBuilder = new IconService.IconBuilder.CallTransactionBuilder()
            .from(from)
            .to(to)
            .value(value)
            .stepLimit(IconConverter.toBigNumber(stepLimit))
            .nid(IconConverter.toBigNumber(this._nid))
            .nonce(IconConverter.toBigNumber(1))
            .version(IconConverter.toBigNumber(3))
            .timestamp((new Date()).getTime() * 1000)
            .method(method)

        // Optional "params" field
        if (Object.keys(params).length !== 0) {
            callTransactionBuilder = callTransactionBuilder.params(params)
        }

        return callTransactionBuilder.build()
    }

    __icxTransactionBuild(from, to, value, stepLimit) {
        return new IconService.IconBuilder.IcxTransactionBuilder()
            .from(from)
            .to(to)
            .value(value)
            .stepLimit(IconConverter.toBigNumber(stepLimit))
            .nid(IconConverter.toBigNumber(this._nid))
            .version(IconConverter.toBigNumber(3))
            .timestamp((new Date()).getTime() * 1000)
            .build()
    }

    
}
export const api = new API(ScoreAdress)
