import React from "react";
import "./GlassCard.css";


const GlassCard = ({title, icon, children}) => {


  return (

    <div className="glass-card">


      {
        title &&

        <div className="glass-card-header">

          <h2>

            {icon}

            {title}

          </h2>


        </div>

      }




      <div className="glass-card-body">

        {children}

      </div>



    </div>

  );

};


export default GlassCard;