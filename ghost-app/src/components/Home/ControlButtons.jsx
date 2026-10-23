import React, { useEffect, useState } from "react";
import "./ControlButtons.css";

const API = "http://192.168.68.156:8000";

export default function ControlButtons() {

    const [running, setRunning] = useState(false);

    useEffect(() => {

        const state = localStorage.getItem("ghost_bot_running");

        if (state === "true") {

            setRunning(true);

        }

    }, []);

    async function toggleBot() {

        try {

            const endpoint = running
                ? "/bot/stop"
                : "/bot/start";

            const response = await fetch(API + endpoint, {

                method: "POST"

            });

            if (response.ok) {

                const newState = !running;

                setRunning(newState);

                localStorage.setItem(
                    "ghost_bot_running",
                    newState
                );

            }

        }

        catch (err) {

            console.log(err);

        }

    }

    async function removeBot() {

        const confirmRemove = window.confirm(
            "Remove Ghost Nexus EA?"
        );

        if (!confirmRemove) return;

        try {

            await fetch(API + "/bot/remove", {

                method: "POST"

            });

        }

        catch (err) {

            console.log(err);

        }

        localStorage.removeItem("ghost_robot");

        localStorage.removeItem("ghost_license");

        localStorage.removeItem("ghost_bot_running");

        setRunning(false);

        window.dispatchEvent(

            new Event("storage")

        );

    }

    function openQuotes() {

        window.location.href = "/mt5";

    }

    return (

        <div className="robot-controls">

            <h2>

                Robot Controls

            </h2>

            <div className="controls-buttons">

                <button

                    className={`power-button ${running ? "on" : "off"}`}

                    onClick={toggleBot}

                >

                    {running ? "🟢 ON" : "🔴 OFF"}

                </button>

                <button

                    className="remove-button"

                    onClick={removeBot}

                >

                    🗑 Remove

                </button>

                <button

                    className="quotes-button"

                    onClick={openQuotes}

                >

                    📈 Quotes

                </button>

            </div>

        </div>

    );

}