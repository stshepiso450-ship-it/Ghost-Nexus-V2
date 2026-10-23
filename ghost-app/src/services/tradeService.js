// =====================================================
// Ghost Nexus Trade Service
// =====================================================


const API_URL = "http://192.168.68.156:8000";




// =====================================================
// SEND AI APPROVED TRADE TO EA
// =====================================================

export async function placeTrade(signal){


    const response = await fetch(

        `${API_URL}/trade/execute`,

        {

            method:"POST",


            headers:{

                "Content-Type":
                "application/json"

            },


            body:JSON.stringify({


                signal:
                signal.signal,


                symbol:
                signal.symbol,


                lot:
                signal.lot || 0.01,


                entry:
                signal.entry,


                sl:
                signal.sl,


                tp:
                signal.tp



            })


        }

    );



    if(!response.ok){

        throw new Error(
            "Trade execution failed"
        );

    }



    return await response.json();


}






// =====================================================
// GET EA STATUS
// =====================================================

export async function getEAStatus(){


    const response =
    await fetch(

        `${API_URL}/ea/status`

    );



    if(!response.ok){

        throw new Error(
            "EA status unavailable"
        );

    }



    return await response.json();


}






// =====================================================
// GET MT5 ACCOUNT STATUS
// =====================================================

export async function getMT5Status(userId){


    const response =
    await fetch(

        `${API_URL}/mt5/status/${userId}`

    );



    if(!response.ok){

        throw new Error(
            "MT5 account unavailable"
        );

    }



    return await response.json();


}