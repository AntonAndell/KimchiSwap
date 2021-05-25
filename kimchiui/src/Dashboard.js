import * as React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems} from './listItems';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import CreateOffer from './CreateOffer'
import {api} from './API'
import { AccountContext } from './AccountContext.js';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
}));

const defaultTheme = createTheme();

function DashboardContent() {
  const account = React.useContext(AccountContext);
  const [Login, setLogin] = React.useState("Sign in");
  const classes = useStyles();
  function signin(){
    if (account.address !== ""){
      account.setAddress("")
      setLogin("Sign in")
      return
    }
    api.iconexAskAddress().then((addr) => {
      account.setAddress(addr)
      if (addr !== ""){
        setLogin("Sign out")
      }
    
    })
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar)}
      >
        
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            align="left"
            sx={{ flexGrow: 1 }}
          >
            KimchiSwap
          </Typography>
          <Typography
            component="h1"
            variant="body1"
            color="inherit"
            paddingRight="2%"
            noWrap
            width="10%"
            align="right"
            sx={{ flexGrow: 1 }}
          >
            {account.address}
          </Typography>
          <Button variant="contained" onClick={signin} aling="right">{Login}</Button>
        
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        padding='15%'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <CreateOffer />
        <Box m={0.5} />
        <Paper elevation={3} rounded="true">
        <Orders />
        </Paper>
        
      </Box>
      
      
    </Box>
  );
}

export default function Dashboard() {
  return (
    // TODO: Remove ThemeProvider once makeStyles is removed
    <ThemeProvider theme={defaultTheme}>
      <DashboardContent />
    </ThemeProvider>
  );
}
