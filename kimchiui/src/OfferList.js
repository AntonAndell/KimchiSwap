import {findSwaps} from './KimchiSwapApi/ScoreApi'
import { useState, useEffect } from 'react';
import {toIcx, toSend} from './utils'
const OfferList = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    findSwaps(setList)
  }, []);
  
  
  
  return <ul>
    <button onClick={()=>findSwaps(setList)}>refresh </button>
    {list.map(offer => (
      <Offer key={offer.id} offer={offer} />
    ))}
  </ul>
};


const Offer = ( {offer}) => (
  <li>
    <div>{offer.id}: {toIcx(offer.in)} {offer.sell} for {offer.ask}{offer.buy} </div>
    <div><button >cancel</button><button >buy</button></div>
  </li>
);
export default OfferList;