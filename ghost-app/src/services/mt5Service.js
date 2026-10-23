const API = "http://192.168.68.156:8000";


export async function getMT5Status(){

    try{

        const response = await fetch(
            `${API}/mt5/status`
        );

        return await response.json();

    }
    catch(error){

        return {
            connected:false
        };

    }

}