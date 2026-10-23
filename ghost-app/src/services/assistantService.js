const SERVER_URL = "http://192.168.68.156:8000";



const assistantService = {



async chat(message){


try{


const response = await fetch(

`${SERVER_URL}/assistant/chat`,

{

method:"POST",

headers:{


"Content-Type":

"application/json"


},


body:JSON.stringify({

message

})


}

);



return await response.json();



}

catch(error){


console.log(

"Assistant Chat Error:",

error

);



return {


success:false,


message:error.message


};


}


},







async voiceCommand(command){


try{


const response = await fetch(

`${SERVER_URL}/assistant/voice`,

{

method:"POST",

headers:{


"Content-Type":

"application/json"


},


body:JSON.stringify({

command

})


}

);



return await response.json();



}

catch(error){


console.log(

"Voice Error:",

error

);



return null;


}


},







async verifyLicense(key){


try{


const response = await fetch(

`${SERVER_URL}/license/verify`,

{

method:"POST",

headers:{


"Content-Type":

"application/json"


},


body:JSON.stringify({

license:key

})


}

);



return await response.json();



}

catch(error){


console.log(

"License Error:",

error

);



return {


active:false


};


}


},







async placeTrade(data){


try{


const response = await fetch(

`${SERVER_URL}/trade/place`,

{

method:"POST",

headers:{


"Content-Type":

"application/json"


},


body:JSON.stringify(data)


}

);



return await response.json();



}

catch(error){


console.log(

"Trade Assistant Error:",

error

);



return null;


}


}





};



export default assistantService;