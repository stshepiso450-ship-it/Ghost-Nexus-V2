import { useState } from "react";


const useDrag = (initialPosition = { x: 0, y: 0 }) => {


  const [position, setPosition] = useState(initialPosition);


  const [dragging, setDragging] = useState(false);



  const [offset, setOffset] = useState({
    x:0,
    y:0
  });





  const handleMouseDown = (e) => {


    setDragging(true);


    setOffset({

      x: e.clientX - position.x,

      y: e.clientY - position.y

    });


  };





  const handleMouseMove = (e) => {


    if(!dragging) return;



    setPosition({

      x: e.clientX - offset.x,

      y: e.clientY - offset.y

    });


  };







  const handleMouseUp = () => {


    setDragging(false);


  };







  const dragStyle = {


    transform:

    `translate(${position.x}px, ${position.y}px)`,


    cursor:

    dragging
    ?
    "grabbing"
    :
    "grab"


  };






  return {


    position,


    dragging,


    dragStyle,


    handleMouseDown,


    handleMouseMove,


    handleMouseUp


  };


};


export default useDrag;