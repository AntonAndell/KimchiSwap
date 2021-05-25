
import { AccountContext } from './AccountContext.js';
import { useContext } from 'react';
import Dashboard from './Dashboard'



const App = () =>{
  const account = useContext(AccountContext);


  return  <div>
            <Dashboard />
          </div>
   
}
export default App;
/*
<div>
            <button onClick={()=>requestAddress(window, account.setAddress)}>Login</button>
            <p>{account.address}</p>
            <OfferList/>
            </div>
            <div>
              <CreateOfferItem />
            </div>
            */