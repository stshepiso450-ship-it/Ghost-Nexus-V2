import { apiRequest } from "./ghostServer";



export async function getSettings(){


    const response = await apiRequest(

        "/settings",

        {
            method:"GET"
        }

    );


    return response || {};

}




export async function saveSettings(data){


    const response = await apiRequest(

        "/settings/save",

        {

            method:"POST",

            body:JSON.stringify(data)

        }

    );


    return response || null;


}




export default {


    getSettings,

    saveSettings


};