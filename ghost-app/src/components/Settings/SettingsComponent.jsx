const defaultSettings = {

theme:"Ghost Red",

primaryColor:"#ff004f",

secondaryColor:"#ff4b91",

background:"Cyber City",

font:"Orbitron",

fontSize:16,


interfaceImage:"",


shape:"rounded",


showGhostCore:true,

showScanner:true,

showRobots:true,

showServerOrb:true,


notifications:true,


aiScanner:true,


assistant:"Ghost AI",


sniperMode:true,


licenseStatus:"NOT ACTIVATED"


};



const [settings,setSettings] = useState(()=>{


const saved = localStorage.getItem(
"ghostNexusSettings"
);


return saved

?

JSON.parse(saved)

:

defaultSettings;


});function saveSettings(){

localStorage.setItem(

"ghostNexusSettings",

JSON.stringify(settings)

);


window.dispatchEvent(

new Event("ghostSettingsUpdated")

);


}