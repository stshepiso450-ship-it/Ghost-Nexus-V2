import {
    useState,
    useEffect,
    useCallback
} from "react";


import {

    getMT5Status,

    getAccount,

    getPositions,

    connectMT5

}
from "../services/mt5Bridge";



function useMT5(){



const [status,setStatus] = useState(null);


const [account,setAccount] = useState(null);


const [positions,setPositions] = useState([]);


const [loading,setLoading] = useState(false);



const loadMT5 = useCallback(async()=>{


    setLoading(true);



    try{


        const serverStatus =
        await getMT5Status();



        setStatus(serverStatus);



        const accountData =
        await getAccount();



        setAccount(accountData);



        const positionData =
        await getPositions();



        setPositions(

            positionData?.positions || []

        );



    }


    catch(error){


        console.error(
            "MT5 Loading Error:",
            error
        );


    }


    finally{


        setLoading(false);


    }


},[]);





useEffect(()=>{


    loadMT5();


    const timer =
    setInterval(()=>{


        loadMT5();


    },10000);



    return()=>clearInterval(timer);



},[loadMT5]);





async function connect(data){


    const result =
    await connectMT5(data);


    await loadMT5();


    return result;


}




return{


    status,


    account,


    positions,


    loading,


    connect,


    refresh:loadMT5


};



}


export default useMT5;