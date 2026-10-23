import { useContext } from "react";

import { SignalContext } from "../context/SignalContext";


const useSignal = () => {


  const context = useContext(SignalContext);



  if(!context){

    throw new Error(
      "useSignal must be inside SignalProvider"
    );

  }



  return context;


};


export default useSignal;