import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';

import {Contracts, toSend} from './utils'
import {api} from './API'
import { AccountContext } from './AccountContext.js';


const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(4),
  },
}));

export default function CreateOffer() {
  const classes = useStyles();
  const account = React.useContext(AccountContext);
  const [makerContract, setMakerContract] = React.useState('Token');
  const [takerContract, setTakerContract] = React.useState('Token');
  const [makerAmount, setMakerAmount] = React.useState('0');
  const [takerAmount, setTakerAmount] = React.useState('0');
  function CreateSwap() {
      if ( account.address != "" ){
        api.createSwap(account.address, makerContract, toSend(makerAmount, makerContract), takerContract, toSend(takerAmount,takerContract))
      }
      console.log("Swappi", makerContract,makerAmount, takerContract, takerAmount)
  };
  return (
    <div align="center" padding="10%">
      
    <Paper elevation={3}  width="20%" height="110%" rounded="true">
    <Box display="flex" justifyContent="center" flexDirection="row" p={1} pt={3} m={1} bgcolor={classes.color}>
      <Box width="15%">
        <FormControl  style={{minWidth: 80}} className={classes.margin}>
          <InputLabel id="makerContract">Token</InputLabel>
          <Select
            labelId="makerContract"
            id="makerContract"
            value={makerContract}
            onChange={(event) => setMakerContract(event.target.value)}
            input={<BootstrapInput />}
           >
            <MenuItem value={makerContract}>
              <em>{makerContract}</em>
            </MenuItem>
            {Contracts.map((token)=>{
                return <MenuItem value={token.contract} >{token.ticker}</MenuItem>;
                })
              }
          </Select>
        </FormControl>
      </Box>
        <Box  pt={3}>
          For
        </Box>
      <Box width="15%">
        <FormControl style={{minWidth: 80}} className={classes.margin}>
          <InputLabel id="makerContract">Token</InputLabel>
          <Select
            labelId="takerContract"
            id="takerContract"
            value={takerContract}
            onChange={(event) => setTakerContract(event.target.value)}
            input={<BootstrapInput />}
          >
            <MenuItem value={takerContract}>
              <em>{takerContract}</em>
            </MenuItem>
            {Contracts.map((token)=>{
                return <MenuItem value={token.contract} >{token.ticker}</MenuItem>;
                })
              }
          </Select>
        </FormControl>
      </Box>
    </Box>

  <Box display="flex" justifyContent="center" flexDirection="row" p={1} m={1} bgcolor={classes.color}>
    <Box width="10%">
      <FormControl style={{width: 60}} className={classes.margin} onChange={(e) => setMakerAmount(e.target.value)}>
        <InputLabel htmlFor="makerAmount">Sell</InputLabel>
        <BootstrapInput id="makerAmount" />
      </FormControl>
    </Box>
    <Box  pt={1.5} bgcolor={classes.color}>
      <SwapHorizIcon fontSize="large" color= "primary"> </SwapHorizIcon>
    </Box>
    <Box width="10%">
      <FormControl style={{width: 60}}  className={classes.margin} onChange={(e) => setTakerAmount(e.target.value)}>
      <InputLabel marginLeft="50%" textAlign="center" htmlFor="makerAmount">Buy</InputLabel>
      <BootstrapInput id="makerAmount" />
    </FormControl>
    </Box>
  
  </Box>

  <Box display="flex" justifyContent="center" flexDirection="row" p={1} m={1} bgcolor={classes.color}>    
    <Button  variant="contained" color="primary" padding="10%" onClick={CreateSwap}>Create SWAP</Button>
  </Box>
    </Paper>
    </div>
  );
}