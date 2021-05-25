import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Title from './Title';
import {api} from './API';
import { AccountContext } from './AccountContext.js';
import {Tokens, toSend, toReadable} from './utils'
import Checkbox from '@material-ui/core/Checkbox';






export default function Orders() {
  const [rows, setRows] = useState([]);
  const [mySwaps, setSwaps] = useState(false);
  const account = React.useContext(AccountContext);
  useEffect(() => {
    api.getSwaps().then((list) => {
      let data = JSON.parse(list)
      setRows(data)
      
      }
    )
  }, []);

  function refresh(){
    api.getSwaps().then((list) => {
      console.log(list)
      let data = JSON.parse(list)
      console.log(data)
      setRows(data)
    })
  }  

  function swap(id, takerContract, takerAmount){
    if (account.address != ""){
      api.swap(account.address, id, takerContract, takerAmount)
    }
  }
  function cancel(id){
    if (account.address != ""){
      api.cancelSwap(account.address, id)
    }
  }
  return (
    <React.Fragment>
      <Title>Swaps</Title>
      
      <Button align="right" variant="contained" color="primary" onClick={refresh}>Refresh</Button>
      <FormControlLabel
          value="top"
          control={<Checkbox color="primary"  checked={mySwaps} onChange={(event)=>{setSwaps(event.target.checked)}} />}
          label="My swaps"
          labelPlacement="top"
        />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Selling</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Asking</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) =>{
            let cell =  <TableCell align="right"><Button  variant="contained" color="primary" onClick={()=>swap(row.id, row.takerContract, row.takerAmount)}>SWAP</Button></TableCell>
            if (mySwaps) {
              cell =  <TableCell align="right"><Button variant="contained" color="primary" onClick={()=>cancel(row.id)}>Cancel</Button></TableCell>
              if( row.maker !== account.address) {
                return
              }
            }
            
         
          return (
            <TableRow key={row.id}>
              <TableCell align="left">{toReadable(row.makerAmount, row.makerContract)}</TableCell>
              <TableCell align="left">{Tokens[row.makerContract]}</TableCell>
              <TableCell align="right">{toReadable(row.takerAmount, row.takerContract)}</TableCell>
              <TableCell align="right">{Tokens[row.takerContract]}</TableCell>
              {cell}
            </TableRow>
          )
          }
          )}
        
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
