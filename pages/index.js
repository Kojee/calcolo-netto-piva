import Head from 'next/head'
import styles from '../styles/Home.module.css'

import TextField from '@mui/material/TextField';
import { useMemo, useState,useEffect  } from 'react';



export default function Home() {
  const [gross, setGross] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [inpsRate, setInpsRate] = useState(0);
  const [result, setResult] = useState({
    taxable: 0,
    taxableAfterInpsContribution: 0,
    inpsContribution: 0,
    irpef: 0,
    net: 0
  })
  const Calcola = () => {
    if(gross * inpsRate > 0){
        const taxable = Math.round((gross - expenses)*100)/100;
        const inpsContribution = Math.round((taxable/100*inpsRate)*100)/100;
        const taxableAfterInpsContribution = taxable - inpsContribution;

        var over75 = taxableAfterInpsContribution - 75000;
        over75 = Math.max(over75, 0)
        const over75Contribution = over75/100*43;

        var over55 = taxableAfterInpsContribution - over75 - 55000;
        over55 = Math.max(over55, 0)

        const over55Contribution = over55/100*41;

        var over28 = taxableAfterInpsContribution - over55 - over75 - 28000;
        over28 = Math.max(over28, 0)

        const over28Contribution = over28/100*38;

        var over15 = taxableAfterInpsContribution - over55 - over75 -over28 - 15000;
        over15 = Math.max(over15, 0)

        const over15Contribution = over15/100*27;

        var over0 = taxableAfterInpsContribution - over55 - over75 -over28 - over15;
        over0 = Math.max(over0, 0)

        const over0Contribution = over0/100*23;

        const irpefContribution = Math.round((over0Contribution + over15Contribution + over28Contribution + over55Contribution + over75Contribution) * 100) / 100;
        const net = Math.round((taxableAfterInpsContribution - irpefContribution)*100)/100;
        return {
          taxable: taxable,
          taxableAfterInpsContribution: taxableAfterInpsContribution,
          inpsContribution: inpsContribution,
          irpef: irpefContribution,
          net: net
        };
      }else{
        return {
          taxable: 0,
          taxableAfterInpsContribution: 0,
          inpsContribution: 0,
          irpef: 0,
          net: 0
        }
      }
  }

  const memResult = useMemo(() => Calcola(),[gross, expenses, inpsRate]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Calcolo Netto Partita Iva Regime Ordinario</title>
        <meta name="description" content="Tool per calcolare netto dal lordo in partita iva con regime ordinario" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1>Calcolo Netto Partita Iva Regime Ordinario</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <TextField required error={false} defaultValue={0} type="number" id="outlined-basic" label="Fatturato" variant="outlined" 
            value={gross} onChange={(e) => setGross( e.target.value)}
            sx={{
              margin: '10px'
            }}/>
            <TextField type="number" id="outlined-basic" label="Spese" variant="outlined" 
            value={expenses} onChange={(e) => setExpenses(e.target.value) }
            sx={{
              margin: '10px'
            }}/>
            <TextField required type="number" id="outlined-basic" label="Aliquota contributi INPS" variant="outlined" 
            value={inpsRate} onChange={(e) => setInpsRate(e.target.value) }
            sx={{
              margin: '10px'
            }}/>
          </div>
          <div style={{ display: "flex",flexDirection: "column" }}>
            <div style={{
              margin: '10px'
            }}>
              Imponibile: <b>{memResult.taxable} €</b>
            </div>
            <div  style={{
              margin: '10px'
            }}>
              Contributi: <b>{memResult.inpsContribution} €</b>
            </div>
            <div  style={{
              margin: '10px'
            }}>
              IRPEF: <b>{memResult.irpef} €</b>
            </div>
            <div  style={{
              margin: '10px'
            }}>
              Netto: <b>{memResult.net} €</b>
            </div>
          </div>
          <br/>
        </div>
      </div>
    </div>
  )
}
