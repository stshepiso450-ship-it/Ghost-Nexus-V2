import React from "react";
import "./NeonButton.css";

const NeonButton = ({
  children,
  onClick,
  type = "primary"
}) => {

  return (

    <button

      className={`neon-btn ${type}`}

      onClick={onClick}

    >

      {children}

    </button>

  );

};

export default NeonButton;