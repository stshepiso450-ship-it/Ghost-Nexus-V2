import React, {
  createContext,
  useContext,
  useState
} from "react";


const LicenseContext = createContext();



export function LicenseProvider({children}){


const [license,setLicense] = useState(

localStorage.getItem("ghostLicense") || ""

);



const [active,setActive] = useState(

localStorage.getItem("licenseActive") === "true"

);






function activateLicense(key){


if(!key){

return false;

}



localStorage.setItem(

"ghostLicense",

key

);



localStorage.setItem(

"licenseActive",

"true"

);



setLicense(key);

setActive(true);



return true;


}







function removeLicense(){


localStorage.removeItem(

"ghostLicense"

);



localStorage.removeItem(

"licenseActive"

);



setLicense("");

setActive(false);


}






return(

<LicenseContext.Provider


value={{

license,

active,

activateLicense,

removeLicense

}}


>


{children}


</LicenseContext.Provider>


);


}







export function useLicense(){


return useContext(LicenseContext);


}