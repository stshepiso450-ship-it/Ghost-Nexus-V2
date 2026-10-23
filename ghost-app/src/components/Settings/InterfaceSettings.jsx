import React, { useContext } from "react";
import { AppContext } from "../../src/context/AppContext";


const InterfaceSettings = () => {


  const context = useContext(AppContext);


  if (!context) {
    return null;
  }


  const {
    settings,
    updateSettings
  } = context;



  const toggleSetting = (name) => {

    updateSettings(
      name,
      !settings[name]
    );

  };



  return (

    <div className="settings-card">


      <h2>
        🎨 Main Interface
      </h2>



      <div className="setting-row">

        <span>
          Neon Effects
        </span>


        <div

          className={
            settings.neon
            ? "toggle active"
            : "toggle"
          }

          onClick={() =>
            toggleSetting("neon")
          }

        />

      </div>





      <div className="setting-row">

        <span>
          Glass Mode
        </span>


        <div

          className={
            settings.glass
            ? "toggle active"
            : "toggle"
          }

          onClick={() =>
            toggleSetting("glass")
          }

        />

      </div>






      <div className="setting-row">

        <span>
          Animations
        </span>


        <div

          className={
            settings.animations
            ? "toggle active"
            : "toggle"
          }

          onClick={() =>
            toggleSetting("animations")
          }

        />

      </div>






      <div className="setting-row">

        <span>
          Interface Font
        </span>


        <select

          value={settings.font || "Orbitron"}

          onChange={(e)=>
            updateSettings(
              "font",
              e.target.value
            )
          }

        >

          <option>Orbitron</option>
          <option>Rajdhani</option>
          <option>Exo 2</option>
          <option>Oxanium</option>

        </select>

      </div>






      <div className="setting-row">

        <span>
          Interface Shape
        </span>


        <select

          value={
            settings.interfaceShape || "Premium"
          }

          onChange={(e)=>
            updateSettings(
              "interfaceShape",
              e.target.value
            )
          }

        >

          <option>Rounded</option>
          <option>Square</option>
          <option>Glass</option>
          <option>Premium</option>

        </select>


      </div>



    </div>

  );

};


export default InterfaceSettings;