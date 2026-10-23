import React, { useEffect, useState } from "react";
import "./RobotList.css";

export default function RobotList() {

    const [bots, setBots] = useState([]);

    useEffect(() => {

        loadBots();

        const interval = setInterval(loadBots, 1000);

        return () => clearInterval(interval);

    }, []);

    function loadBots() {

        const robot = localStorage.getItem("ghost_robot");

        if (robot) {

            setBots([robot]);

        }

        else {

            setBots([]);

        }

    }

    return (

        <div className="robot-list">

            <h2>

                Active Bots

            </h2>

            {

                bots.length === 0 ?

                (

                    <div className="empty-bot">

                        No Active Bots

                    </div>

                )

                :

                (

                    bots.map((bot,index)=>(

                        <div

                            key={index}

                            className="robot-card"

                        >

                            🤖 {bot}

                        </div>

                    ))

                )

            }

        </div>

    );

}