import React, { useState } from "react";
import "./Quotes.css";
import TradeSettings from "./TradeSettings";

const symbols = [
  "XAUUSD",
  "XAGUSD",

  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "USDCHF",
  "USDCAD",
  "AUDUSD",
  "NZDUSD",

  "EURJPY",
  "GBPJPY",
  "EURGBP",
  "AUDJPY",
  "CHFJPY",

  "NAS100",
  "US30",
  "SPX500",
  "GER40",
  "UK100",

  "BTCUSD",
  "ETHUSD"
];

export default function Quotes() {

    const [search,setSearch]=useState("");

    const [selected,setSelected]=useState([]);

    function toggleSymbol(symbol){

        if(selected.includes(symbol)){

            setSelected(
                selected.filter(s=>s!==symbol)
            );

        }else{

            setSelected([
                ...selected,
                symbol
            ]);

        }

    }

    const filtered = symbols.filter(symbol =>
        symbol.toLowerCase().includes(search.toLowerCase())
    );

    return(

        <div className="quotes-page">

            <div className="quotes-header">

                <h1>Ghost Quotes</h1>

                <p>Select symbols Ghost AI should monitor.</p>

            </div>

            <input

                className="search-symbol"

                placeholder="Search Symbol..."

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

            />

            <div className="symbol-list">

                {

                    filtered.map(symbol=>(

                        <label

                        key={symbol}

                        className="symbol-item"

                        >

                            <input

                            type="checkbox"

                            checked={selected.includes(symbol)}

                            onChange={()=>toggleSymbol(symbol)}

                            />

                            {symbol}

                        </label>

                    ))

                }

            </div>

            <TradeSettings selectedSymbols={selected}/>

        </div>

    );

}