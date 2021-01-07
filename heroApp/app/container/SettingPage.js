import React,{useEffect,useState} from 'react';
import { View , Text , TextInput as Input,ScrollView} from 'react-native';
import { Button, Switch, ProgressBar, Modal, Portal, Provider, TextInput } from 'react-native-paper';
import {getOperatorData,getDeviceData} from '../services/DataService';
import Material from 'react-native-vector-icons/Ionicons';

export default SettingPage = () => {
    console.log(">>Data ",getOperatorData(),JSON.stringify(getDeviceData()))
    const [deviceData] = useState(getDeviceData());
    const [isSwitchEleOn, setIsSwitchEleOn] = useState(false);
    const [isSwitchTrgOn, setIsSwitchTrgOn] = useState(false);
    const onToggleEleSwitch = () => setIsSwitchEleOn(!isSwitchEleOn);
    const onToggleTrgSwitch = () => setIsSwitchTrgOn(!isSwitchTrgOn);
    return(<>
     <View style={{backgroundColor:'#fff',height:"100%"}}>
            <View style={{padding:18}}>
                   <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:20,width:"100%"}}>
                    <Text style={{fontSize:20}}>Electrostatic</Text>
                    <Switch value={isSwitchEleOn} onValueChange={onToggleEleSwitch} color={'#012554'}/>
                   </View>
                   <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:20}}>
                    <Text style={{fontSize:20}}>Trigger Lock</Text>
                    <Switch value={isSwitchTrgOn} onValueChange={onToggleTrgSwitch} color={'#012554'}/>
                   </View>
                   <View style={{flexDirection:"row",justifyContent:"space-between",paddingBottom:20}}>
                    <Text style={{fontSize:20,}}>Battery</Text>
                    <Text style={{fontSize:18,}}>{isNaN(parseInt(deviceData["getBatteryLevel\r"]))?'0':parseInt(deviceData["getBatteryLevel\r"])} %</Text>
                   </View>
                   <ProgressBar style={{height:10}} progress={parseInt(deviceData["getBatteryLevel\r"])/100} color={'#012554'} />

                   <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:30}}>
                    <Text style={{fontSize:20,fontWeight:"bold"}}>System Info.</Text>
                    {/* <Text style={{fontSize:18,}}>90%</Text> */}
                   </View>
                   <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:10}}>
                    <Text style={{fontSize:20}}>Operator:</Text>
                    <Text style={{fontSize:18,}}>{getOperatorData().name}</Text>
                   </View>
                   <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:10}}>
                    <Text style={{fontSize:20}}>Sprayer:</Text>
                    <Text style={{fontSize:18,}}>{'GhostBuster'}</Text>
                   </View>
                   <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:10}}>
                    <Text style={{fontSize:20}}>Area Sprayed:</Text>
                    <Text style={{fontSize:18,}}>22,431 sq ft</Text>
                   </View>
                   <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:10}}>
                    <Text style={{fontSize:20}}>Time Sprayed:</Text>
                    {/* <Text style={{fontSize:18,}}>90%</Text> */}
                   </View>
                   <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:10,marginBottom:35}}>
                    <Text style={{fontSize:20}}>Session Start:</Text>
                    {/* <Text style={{fontSize:18,}}>90%</Text> */}
                   </View>
                   <Button 
                        color={'#012554'}
                        // mode={'outlined'}
                        uppercase={false}
                        //   disabled={deviceStatus === "Ready"?false:true}
                        labelStyle={{fontSize:18}} 
                        icon={props=><Material 
                            size={25}
                            color={'#012554'}
                            name="exit-outline"/>}
                        contentStyle={{ borderColor:'#012554',borderWidth:1,borderRadius:4,flexDirection:"row-reverse",paddingTop:1,height:47,width:"75%",alignSelf:"center"}}
                        // onPress={()=>{
                        //     navigation.navigate('HomePage');
                        // }}
                        >
               {'Finish Session'}
             </Button>
                </View>
              
          </View>
    </>)
}