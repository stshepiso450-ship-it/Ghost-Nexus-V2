import React from "react";
import "./FontSettings.css";
import { useApp } from "../../context/AppContext";

const fonts = [

"Orbitron",
"Rajdhani",
"Audiowide",
"Exo 2",
"Poppins",
"Montserrat",
"Roboto",
"Inter",
"Oswald",
"Bebas Neue",

"Titillium Web",
"Barlow",
"Barlow Condensed",
"Anton",
"Rubik",
"Ubuntu",
"Nunito",
"Kanit",
"Teko",
"Prompt",

"Archivo",
"Space Grotesk",
"Space Mono",
"Manrope",
"Sora",
"Outfit",
"Urbanist",
"Syne",
"Jost",
"Righteous",

"Electrolize",
"Oxanium",
"Chakra Petch",
"Russo One",
"Michroma",
"Syncopate",
"Wallpoet",
"Aldrich",
"Quantico",
"Black Ops One",

"Tomorrow",
"Zen Dots",
"Nova Square",
"Share Tech",
"Share Tech Mono",
"Major Mono Display",
"Iceland",
"Goldman",
"Orbit",
"Geo",

"Abel",
"Asap",
"Cabin",
"Comfortaa",
"DM Sans",
"Fira Sans",
"Hind",
"Inconsolata",
"Karla",
"Lato",

"Lexend",
"Maven Pro",
"Mulish",
"Noto Sans",
"Overpass",
"PT Sans",
"Questrial",
"Red Hat Display",
"Signika",
"Work Sans",

"Archivo Black",
"Archivo Narrow",
"Arimo",
"Cormorant",
"Domine",
"Encode Sans",
"Fjalla One",
"Heebo",
"IBM Plex Sans",
"Libre Franklin",

"M PLUS 1",
"Merriweather Sans",
"Mukta",
"Nanum Gothic",
"Plus Jakarta Sans",
"Public Sans",
"Ropa Sans",
"Sarabun",
"Source Sans Pro",
"Varela Round",

"Yantramanav",
"Zilla Slab",
"Assistant",
"Catamaran",
"Commissioner",
"Dosis",
"Epilogue",
"Figtree",
"Gantari",
"Hanken Grotesk"

];

export default function FontSettings(){

const { settings, updateSettings } = useApp();

function selectFont(font){

updateSettings({

font:font

});

}

return(

<div className="font-settings">

<h2>

🔤 Font Settings

</h2>

<p>

Choose your Ghost Nexus interface font.

</p>

<div className="font-grid">

{

fonts.map((font,index)=>(

<div

key={index}

className={

settings.font===font

?

"font-card active"

:

"font-card"

}

style={{

fontFamily:font

}}

onClick={()=>selectFont(font)}

>

<div className="font-preview">

Aa

</div>

<h3>

{font}

</h3>

<p>

Ghost Nexus

</p>

</div>

))

}

</div>

<div className="selected-font">

Current Font

<strong>

{settings.font}

</strong>

</div>

</div>

);

}