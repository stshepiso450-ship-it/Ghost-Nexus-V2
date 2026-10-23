import React from "react";

function RobotCard({ robot }) {

  return (

    <div className="robot-card">

      <div className="robot-name">

        {robot.name}

      </div>

      <div className="robot-status">

        {robot.connected ? "🟢 Connected" : "🔴 Offline"}

      </div>

      <div className="robot-profit">

        Profit : {robot.profit}

      </div>

      <div style={{ marginTop: 12, color: "#ccc" }}>

        Strategy : {robot.strategy}

      </div>

      <div style={{ marginTop: 8 }}>

        Last Signal : {robot.signal}

      </div>

    </div>

  );

}

export default RobotCard;