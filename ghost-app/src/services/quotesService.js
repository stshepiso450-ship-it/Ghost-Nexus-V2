import {apiRequest} from "./ghostServer";



export async function getQuotes(){


const response = await apiRequest(

"/quotes",

{

method:"GET"

}

);



return response || {

quotes:[]

};


}



export async function getSymbolQuote(symbol){


return await apiRequest(

`/quotes/${symbol}`,

{

method:"GET"

}

);


}



export default {

getQuotes,

getSymbolQuote

};