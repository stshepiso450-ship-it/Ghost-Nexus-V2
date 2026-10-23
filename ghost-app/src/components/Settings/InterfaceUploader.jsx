import React, {useState} from "react";
import "./InterfaceUploader.css";


export default function InterfaceUploader(){


const savedImage =
localStorage.getItem("ghostInterface");


const [image,setImage] = useState(savedImage || "");



const handleUpload=(event)=>{


const file = event.target.files[0];


if(file){


const reader = new FileReader();


reader.onload = ()=>{


localStorage.setItem(
"ghostInterface",
reader.result
);


setImage(reader.result);


};


reader.readAsDataURL(file);


}


};



return(

<div className="interface-uploader">


<h2>
Ghost Core Interface
</h2>



<div className="preview-box">


{

image ?


<img

src={image}

alt="Interface Preview"

/>


:

<div className="empty-preview">

No Interface Selected

</div>


}


</div>



<label className="upload-button">


Upload Interface Image


<input

type="file"

accept="image/*"

onChange={handleUpload}

/>


</label>



<p>

This image will appear inside Ghost Core

</p>



</div>

);


}