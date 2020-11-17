var service = {};

let peripherial = {};
let currentCommand = "";

//service.deviceName = 'GhostBaster_V1';

service.bleService = "d973f2e0-b19e-11e2-9e96-0800200c9a66";
service.TXCharacteristic = "d973f2e1-b19e-11e2-9e96-0800200c9a66";
service.RXCharacteristic = "d973f2e2-b19e-11e2-9e96-0800200c9a66";
service.UART = "0000fee3-0000-1000-8000-00805f9b34fb";

let defaultBleResults = {
    'getSerial\r' : "",
    'getModel\r': "",
    'getPumpTime\r' : "",
    'getPumpedVolume\r' : "",
    'getUnitName\r' : "",
    'getHWVersion\r' : "",
    'setUnitName\r' : "",
    'getTriggerLatchState\r' : "",
    'getTriggerLatchMode\r' : "",
    'resetPump\r' : "",
    'getESVState\r' : "",
    'getFlowRate\r' : "",
    'getFirmware\r' : "",
    'updateFirmware\r' : "",
    'sprayDisable\r':"",
    'sprayEnable\r':"",
    'getPumpState\r':"",
    'getHVState\r':"",
    'getError\r':"",
    'getFlow\r':"",
    'getESV\r':"",
    'getBatteryLevel\r':""
    //bleResults
}

export var bleCommands = [
   /* 'getSerial\r',
    'getModel\r',
    'getTotalTime\r',
    'getTotalVolume\r',
    'getFirmware\r',
    'updateFirmware\r',
    'sprayDisable\r',
    'sprayEnable\r',
    'getPumpState\r',
    'getHVState\r',
    'getError\r',
    'getFlow\r',
    'getESV\r',
    'getBatteryLevel\r'*/
    'getSerial\r' ,
    'getModel\r',
    'getPumpTime\r' ,
    'getPumpedVolume\r' ,
    'getUnitName\r' ,
    'getHWVersion\r' ,
    'setUnitName\r' ,
    'getTriggerLatchState\r' ,
    'getTriggerLatchMode\r' ,
    'resetPump\r' ,
    'getESVState\r' ,
    'getFlowRate\r' ,
    'getFirmware\r' ,
    'updateFirmware\r' ,
    'sprayDisable\r',
    'sprayEnable\r',
    'getPumpState\r',
    'getHVState\r',
    'getError\r',
    'getFlow\r',
    'getESV\r',
    'getBatteryLevel\r'
];

/*getPumpTime getPumpedVolume getUnitName getHWVersion setUnitName getTriggerLatchState setTriggerLatchState getTriggerLatchMode setTriggerLatchMode resetPump getESVState getFlowRate */
export var bleResults = {
    'getSerial\r' : "",
    'getModel\r': "",
    'getPumpTime\r' : "",
    'getPumpedVolume\r' : "",
    'getUnitName\r' : "",
    'getHWVersion\r' : "",
    'setUnitName\r' : "",
    'getTriggerLatchState\r' : "",
    'getTriggerLatchMode\r' : "",
    'resetPump\r' : "",
    'getESVState\r' : "",
    'getFlowRate\r' : "",
    'getFirmware\r' : "",
    'updateFirmware\r' : "",
    'sprayDisable\r':"",
    'sprayEnable\r':"",
    'getPumpState\r':"",
    'getHVState\r':"",
    'getError\r':"",
    'getFlow\r':"",
    'getESV\r':"",
    'getBatteryLevel\r':""
    //bleResults
}

export var setDefaultValue = ()=>{
    bleResults = defaultBleResults;
    isReadOk = false;
}


export var getCurrentCmd = ()=>{
    return currentCommand;
}

export var setCurrentCmd = (cmd)=>{
    currentCommand = cmd;
}
/*
{"getSerial\r":"S/N 0000001\r","getModel\r":"V2020-SEP\r","getTotalTime\r":"","getTotalVolume\r":"","getFirmware\r":"000000001\r","updateFirmware\r":"Under Development\r","sprayDisable\r":"","sprayEnable\r":"","getPumpState\r":"Water Pump is off.","getHVState\r":"","getError\r":"","getFlow\r":"","getESV\r":"","getBatteryLevel\r":"  0%\r"}
*/


/*getPumpTime getPumpedVolume getUnitName getHWVersion setUnitName getTriggerLatchState setTriggerLatchState getTriggerLatchMode setTriggerLatchMode resetPump getESVState getFlowRate */
export var initCmdSeq = [
    'getSerial\r' ,
    'getModel\r',
    'getPumpTime\r' ,
    'getPumpedVolume\r' ,
    'getUnitName\r' ,
    'getHWVersion\r' ,
    'setUnitName\r' ,
    //'getTriggerLatchState\r' ,
    'getTriggerLatchMode\r' ,
    'resetPump\r' ,
    'getESVState\r' ,
    'getFlowRate\r' ,
    'getFirmware\r' ,
    'updateFirmware\r' ,
    //'sprayDisable\r',
    //'sprayEnable\r',
    'getPumpState\r',
    //'getHVState\r',
    //'getError\r',
    //'getFlow\r',
    //'getESV\r',
    'getBatteryLevel\r',
    /*
    'getSerial\r', //this must be first
    'getModel\r',
    //'getPumpTime\r',
    //'getPumpedVolume\r',
    'getFirmware\r',
    'updateFirmware\r',
    'getUnitName\r',
    'getHWVersion\r',
    'setUnitName\r',
    'getTriggerLatchState\r',
    'setTriggerLatchState\r',
    'getTriggerLatchMode\r',
    'setTriggerLatchMode\r',
    'resetPump\r',
    //'sprayDisable\r',
    //'sprayEnable\r',
    //'getHVState\r',
    //'getError\r',
    //'getFlow\r',
    'getBatteryLevel\r',
    'getESVState\r',
    'getPumpState\r',
    'getFlowRate\r',*/
    'done'
];

var isReadOk = false;
export var getReadOk = () => {
    return isReadOk;
}
export var setReadOk = (val) => {
    isReadOk = val;
}

service.getPeripherial= function(){
    return peripherial;
};
service.setPeripherial = function(p){
    peripherial=p;
};

service.diconnectDevice = function(){
    if(peripherial.id != undefined){
        BleManager.disconnect(peripherial.id);
    }
};

export default service;

