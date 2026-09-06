import { useEffect, useRef, useState } from 'react';
interface Props {isOpen:boolean; onClose:()=>void;}
export default function LeadMagnet({isOpen,onClose}:Props){
  const dialog=useRef<HTMLDialogElement>(null);
  const [cash,setCash]=useState(''); const [burn,setBurn]=useState('');
  useEffect(()=>{if(isOpen)dialog.current?.showModal();else dialog.current?.close();},[isOpen]);
  const cashValue=Number(cash), burnValue=Number(burn);
  const valid=cash!==''&&burn!==''&&Number.isFinite(cashValue)&&Number.isFinite(burnValue)&&cashValue>=0&&burnValue>=0;
  return <dialog ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="runway-title" className="runway-dialog"><button autoFocus className="secondary" onClick={onClose}>Close ×</button><h2 id="runway-title">Runway calculator</h2><p>A simple estimate using current cash and monthly net cash burn. Use the same currency for both values.</p><label htmlFor="cash">Available cash</label><input id="cash" type="number" min="0" step="any" value={cash} onChange={e=>setCash(e.target.value)}/><label htmlFor="burn">Monthly net cash burn</label><input id="burn" type="number" min="0" step="any" value={burn} onChange={e=>setBurn(e.target.value)}/><output aria-live="polite">{valid?(burnValue>0?`${(cashValue/burnValue).toFixed(1)} months of runway`:'No net cash burn entered. A finite runway cannot be estimated.'):'Enter non-negative amounts to estimate runway.'}</output><p>Assumes cash burn remains constant. Future revenue, financing, one-off costs and payment timing can change the result.</p></dialog>;
}
