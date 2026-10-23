import React from "react";
import "./ShapeSettings.css";
import { useApp } from "../../context/AppContext";

const shapes = [

"Rounded",
"Rounded Large",
"Rounded Small",
"Circle",
"Pill",
"Square",
"Soft Square",
"Glass",
"Glass Rounded",
"Glass Circle",

"Hexagon",
"Hexagon Neon",
"Octagon",
"Diamond",
"Diamond Neon",
"Triangle",
"Shield",
"Cyber Panel",
"Cyber Panel 2",
"Cyber Box",

"Ghost",
"Ghost Glass",
"Ghost Neon",
"Ghost Frame",
"Ghost Edge",

"Sci-Fi",
"Futuristic",
"AI",
"AI Glass",
"AI Neon",

"Modern",
"Minimal",
"Flat",
"Floating",
"Elevated",

"Dark",
"Dark Glass",
"Dark Neon",
"Luxury",
"Luxury Gold",

"Terminal",
"Hologram",
"Tech",
"Tech Glass",
"Space",

"Crystal",
"Ice",
"Matrix",
"Fire",
"Electric"

];

export default function ShapeSettings(){

const { settings, updateSettings } = useApp();

function selectShape(shape){

updateSettings({

shape

});

}

return(

<div className="shape-settings">

<h2>

🧩 Interface Shapes

</h2>

<p>

Select the appearance of buttons, cards and panels.

</p>

<div className="shape-grid">

{

shapes.map((shape,index)=>(

<div

key={index}

className={

settings.shape===shape

?

"shape-card active"

:

"shape-card"

}

onClick={()=>selectShape(shape)}

>

<div className="shape-preview">

◼

</div>

<h3>

{shape}

</h3>

</div>

))

}

</div>

<div className="selected-shape">

Current Shape

<strong>

{settings.shape}

</strong>

</div>

</div>

);

}