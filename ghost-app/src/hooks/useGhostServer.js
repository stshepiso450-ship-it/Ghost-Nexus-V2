import { useContext } from "react";

import { ServerContext } from "../context/ServerContext";


const useGhostServer = () => {


  const context = useContext(ServerContext);



  if(!context){

    throw new Error(
      "useGhostServer must be inside ServerProvider"
    );

  }



  return context;


};


export default useGhostServer;