const API_URL = "http://192.168.68.156:8000";


export async function getLiveSignals(){

    try{


        const res = await fetch(

            `${API_URL}/signals`

        );


        if(!res.ok){

            throw new Error(
                "Signal error"
            );

        }


        return await res.json();


    }catch(error){


        console.log(
            "Signal offline"
        );


        return {


            symbol:"--",

            direction:"WAIT",

            confidence:0,

            entry:"--",

            tp:"--",

            sl:"--"


        };


    }

}