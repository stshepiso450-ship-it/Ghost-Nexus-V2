import { apiRequest } from "./ghostServer";



export async function startRobot(){


    return await apiRequest(

        "/bot/start",

        {
            method:"POST"
        }

    );


}




export async function stopRobot(){


    return await apiRequest(

        "/bot/stop",

        {
            method:"POST"
        }

    );


}




export async function getRobotStatus(){


    return await apiRequest(

        "/bot/status",

        {
            method:"GET"
        }

    );


}