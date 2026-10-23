import React, {
  useState,
  useEffect
} from "react";

import "./settingscomponent.css";



export default function BackgroundSettings(){



const [background,setBackground]=useState("");

const [type,setType]=useState("");






useEffect(()=>{


const savedFile = localStorage.getItem(
"backgroundFile"
);



const savedType = localStorage.getItem(
"backgroundType"
);



if(savedFile){

setBackground(savedFile);

setType(savedType);

}



},[]);








function uploadBackground(e){


const file=e.target.files[0];



if(!file){

return;

}




const reader=new FileReader();





reader.onload=()=>{



const result=reader.result;



let fileType="image";



if(file.type.startsWith("video")){


fileType="video";


}




setBackground(result);

setType(fileType);





localStorage.setItem(

"backgroundFile",

result

);



localStorage.setItem(

"backgroundType",

fileType

);






window.dispatchEvent(

new Event(

"ghost-settings-update"

)

);



};




reader.readAsDataURL(file);



}







function removeBackground(){



localStorage.removeItem(

"backgroundFile"

);



localStorage.removeItem(

"backgroundType"

);



setBackground("");

setType("");




window.dispatchEvent(

new Event(

"ghost-settings-update"

)

);



}








return(


<div className="setting-box">



<h3>
🌌 Background Settings
</h3>



<p>
Upload a background image or video for the whole app.
</p>





<input

type="file"

accept="image/*,video/*"

onChange={uploadBackground}

/>








{

background && type==="image" &&


<img

src={background}

className="background-preview"

alt="Background Preview"

/>


}








{

background && type==="video" &&


<video

src={background}

className="background-preview"

autoPlay

loop

muted

playsInline

/>


}








<button

onClick={removeBackground}

>

Remove Background

</button>





</div>


);


}