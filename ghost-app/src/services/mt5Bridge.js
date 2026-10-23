import {apiRequest} from "./ghostServer";



export function getMT5Status(){


return apiRequest(
"/status"
);


}




export function connectMT5(data){


return apiRequest(

"/connect",

{

method:"POST",

body:JSON.stringify(data)

}

);


}




export function getAccount(){


return apiRequest(
"/account"
);


}




export function getPositions(){


return apiRequest(
"/positions"
);


}