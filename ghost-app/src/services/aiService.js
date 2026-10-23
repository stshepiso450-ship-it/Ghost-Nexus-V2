// =====================================================
// Ghost Nexus AI Service
// =====================================================

const API_URL = "http://192.168.68.156:8000";



// =====================================================
// ANALYZE CHART IMAGE
// =====================================================

export async function analyzeChart(
    image,
    symbol = "XAUUSD",
    lot = 0.01,
    maxTrades = 1
){

    const formData = new FormData();


    formData.append(
        "image",
        image
    );


    formData.append(
        "symbol",
        symbol
    );


    formData.append(
        "lot",
        lot
    );


    formData.append(
        "max_trades",
        maxTrades
    );



    const response = await fetch(

        `${API_URL}/ai/analyze`,

        {
            method:"POST",

            body:formData
        }

    );



    if(!response.ok){

        throw new Error(
            "AI Scanner failed"
        );

    }



    return await response.json();

}






// =====================================================
// AI STATUS
// =====================================================

export async function getAIStatus(){


    const response = await fetch(

        `${API_URL}/ai/status`

    );


    return await response.json();

}