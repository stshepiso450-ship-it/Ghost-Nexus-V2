const API = "http://192.168.68.156:8000";

/* ===========================
   MT5 CONNECTION
=========================== */

export async function connectMT5(login, password, server) {

    const response = await fetch(`${API}/connect`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            login: Number(login),

            password,

            server

        })

    });

    if (!response.ok) {

        throw new Error("Unable to connect");

    }

    return await response.json();

}

/* ===========================
   DISCONNECT
=========================== */

export async function disconnectMT5() {

    const response = await fetch(`${API}/disconnect`, {

        method: "POST"

    });

    return await response.json();

}

/* ===========================
   ACCOUNT
=========================== */

export async function getAccount() {

    const response = await fetch(`${API}/account`);

    return await response.json();

}

/* ===========================
   BOT STATUS
=========================== */

export async function getBotStatus() {

    const response = await fetch(`${API}/bot/status`);

    return await response.json();

}

/* ===========================
   START BOT
=========================== */

export async function startBot() {

    const response = await fetch(`${API}/bot/start`, {

        method:"POST"

    });

    return await response.json();

}

/* ===========================
   STOP BOT
=========================== */

export async function stopBot() {

    const response = await fetch(`${API}/bot/stop`, {

        method:"POST"

    });

    return await response.json();

}

/* ===========================
   SCANNER STATUS
=========================== */

export async function scannerStatus(){

    const response = await fetch(`${API}/scanner/status`);

    return await response.json();

}

/* ===========================
   AI ANALYZE IMAGE
=========================== */

export async function analyzeChart(file){

    const form = new FormData();

    form.append("image", file);

    const response = await fetch(`${API}/scanner/analyze`,{

        method:"POST",

        body:form

    });

    return await response.json();

}

/* ===========================
   PLACE TRADE
=========================== */

export async function placeTrade(signal){

    const response = await fetch(`${API}/trade/place`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(signal)

    });

    return await response.json();

}

/* ===========================
   OPEN POSITIONS
=========================== */

export async function getPositions(){

    const response = await fetch(`${API}/positions`);

    return await response.json();

}

/* ===========================
   CLOSE POSITION
=========================== */

export async function closePosition(ticket){

    const response = await fetch(`${API}/trade/close`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            ticket

        })

    });

    return await response.json();

}