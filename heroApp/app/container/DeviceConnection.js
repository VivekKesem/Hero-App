import React,{useEffect,useState} from 'react';
import { View, TextInput as Input,FlatList,Text,TouchableOpacity,StyleSheet ,Image, Animated , Easing} from 'react-native';
import { Avatar, Button, ActivityIndicator,Modal } from 'react-native-paper';
import Material from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { EventRegister } from 'react-native-event-listeners';
import { getOperatorData, setDeviceData, getDeviceHWData, setDeviceHWData , sessionDataList } from '../services/DataService';
import {initDB, addSprayer, getSprayers, getSprayersByHwId, delSprayer} from '../services/DBService';
import LearnHow from './LearnHow';

let deviceListAr = [];
export default DeviceConnection = ({navigation})=>{

    const [count,setCount] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [deviceStatus, setDeviceStatus] = useState('');
    const [deviceList, setDeviceList] = useState([]);
    const [isDeviceConnected, setisDeviceConnected] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    let rotateValue = new Animated.Value(0);
    
    let rotation = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],// degree of rotation
      }); 
    listEmptyComponent = () => {
        return (
            <View>
                <Text style={{fontSize: 18,}}>{deviceStatus === 'Disconnected' || deviceStatus === 'stopScan' || deviceStatus === 'error'?'No device found.':deviceStatus}</Text>
            </View>
        )
    }

    useEffect(()=>{
        if(count){
            initDB('sprayers').then((res)=>{
              console.log(">>Res ",res);
            });
          setCount(false);
        }
        if(deviceStatus == ''){
            EventRegister.emit('BLECMD', { cmd: 'startScan' });
        }
        
        var listener = EventRegister.addEventListener('BLE_STATUS', (data) => {
            console.log(">>BLE_STATUS ",data);
            if(data.event == "Data_Recieved"){
                console.log(data.value);
              }
             
              if(data.event == "error"){
                  setisDeviceConnected(false);
                  setDeviceStatus("Disconnected");
                  navigation.navigate('FirstConnection');
                }
              if(data.event == "connected"){
                setisDeviceConnected(true);
                setDeviceStatus("Connected");
                // hideModal()
              //   setSessionDataList([]); // set temp
  
              }else if(data.event == "bleDevices"){
                  console.log(">>devices ",data.devices);
                  deviceListAr.push(data.devices);
                  var arrayUniqueByKey = [...new Map(deviceListAr.map(item =>
                    [item['id'], item])).values()];
                  setDeviceList(arrayUniqueByKey);
               
              }else if(data.event == "reading"){
                setDeviceStatus("Reading...");
              }else if(data.event == "readOK"){
                setDeviceStatus("Ready");
              }else if(data.event == "scanning"){
                setDeviceStatus("Scanning...");
                // showModal();  
              }else if(data.event == "disconnected"){
                // setDefaultValue();
              //   setSessionDataList([]); // set temp
                setisDeviceConnected(false);
                // navigation.navigate('Home');
                setDeviceStatus("Disconnected");
                navigation.navigate('FirstConnection');
              //   setTimeout(()=>{
              //     setDeviceStatus("Disconnected");
              //   },500)
              }else if(data.event ==='stopScan'){
                  // Alert.alert('HeroApp','No device found.')
                  setDeviceStatus("stopScan");
              }
            });
            return ()=>{
              EventRegister.removeEventListener(listener);
            //   BackHandler.removeEventListener('hardwareBackPress', () => true)
          }  
    })
    let refreshDeviceList = ()=>{
        // Animated.timing(rotateValue, {
        //     toValue: 1,
        //     duration: 700,
        //     // easing: Easing.linear,
        //     useNativeDriver: true
        //   }).start((val)=>{
        //     console.log(">>Val ",val);
        //     if(val.finished){
        //         rotateIcon();
        //     }
           
        //   });
        Animated.loop(
            Animated.timing(
              rotateValue,
              {
               toValue: 1,
               duration: 1000,
               easing: Easing.linear,
               useNativeDriver: true
              }
            )
           ).start();
           EventRegister.emit('BLECMD', { cmd: 'startScan' });
           setDeviceStatus('');
           setSelectedId(null);
        //    setDeviceList([]);
    }
    return(<>
    <View style={{flex:1,width:"85%",height:"100%",alignSelf:"center",marginTop:30}}>
        <View style={{justifyContent:"space-between",flexDirection:"row"}}>  
            <Text style={{fontSize:18,paddingBottom:10,}}>Power ON sprayer</Text>
            <TouchableOpacity onPress={()=>{setModalVisible(true)}} style={{paddingBottom:10}}>
            <Text style={{fontSize:18,color:"#012554", textDecorationLine:"underline",fontWeight:"700"}}>Learn how</Text>
            </TouchableOpacity>
            
        </View>
        
        <Image source={require('../asset/sprayDevice.png')} style={{alignSelf:"center",width:"100%",borderWidth:0.7,borderColor:"gray"}}/>
        <View style={{flexDirection:"row",justifyContent:"space-between",paddingBottom:10,marginTop:20}}>
            <Text style={{fontSize:18}}>Select sprayer</Text>
            {
            // (deviceStatus === 'Disconnected' || deviceStatus === 'stopScan' || deviceStatus === 'error' || deviceStatus === 'scanning')  && 
            <Animated.View style={{transform:[{ rotate: rotation }]}}>
               <FontAwesome onPress={()=>refreshDeviceList()} name="refresh" size={22}/>
            </Animated.View>} 
        </View>
        <View style={{height:200,backgroundColor:"white",padding:15,paddingLeft:20,borderWidth:0.7,borderColor:"gray"}}> 
            <FlatList
                showsVerticalScrollIndicator={true}
                ListEmptyComponent={listEmptyComponent}
                data={deviceList}
                // data={[...Array(10).keys()]}
                renderItem={({ item,index }) => {
                    const backgroundColor = item === selectedId ? "#fff" : "#fff";
                    const color = item === selectedId ? '#012554' : 'black';
                    const boldness = item === selectedId ? "bold":"300";
                    return (
                        <TouchableOpacity onPress={()=>setSelectedId(item)} style={[styles.item,{backgroundColor:backgroundColor,borderLeftWidth:item === selectedId ?5:0,borderLeftColor:color}]}>
                             <Text style={[styles.title,{color:color,paddingLeft:10,fontWeight:boldness}]}>{item.name}</Text>
                        </TouchableOpacity>
                    );
                  }}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
        />
       
        </View>
        <Button 
                style={{flexDirection:"row",borderRadius:4,height:47,justifyContent:"center",marginTop:30}}
                color={'#012554'}
                mode={'contained'}
                disabled={selectedId != null ?deviceStatus == "Reading..." || deviceStatus == 'Connected' ?true:false:true}
                uppercase={false}
                labelStyle={{fontSize:18, textTransform: 'capitalize'}} 
                icon={props=><Material 
                    size={25}
                    color={'#fff'}
                    name="keyboard-arrow-right"/>}
                contentStyle={{flexDirection:"row-reverse",paddingTop:1,height:47,width:"90%",alignSelf:"center"}}
                onPress={()=>{
                    if(deviceStatus != 'Connected' && deviceStatus != 'Ready'){
                        EventRegister.emit('BLECMD',{event:'reqConnect',device:selectedId})
                    }
                    
                    if(deviceStatus == 'Ready'){
                        var deviceObj = {
                            sdName:getDeviceHWData().sdName,
                            hardwareId:getDeviceHWData().hardwareId,
                            serverId:null,
                            isSync:0,
                            sprayerName:getDeviceHWData().sprayerName
                        }
                      
                        getSprayersByHwId(getDeviceHWData().hardwareId).then((resDevice)=>{
                          if(resDevice.length){
                              console.log(">>resDevice",resDevice);
                              deviceObj.serverId = resDevice[0].serverId;
                              deviceObj.sprayerName = resDevice[0].sprayerName;
                          }else{
                              addSprayer(deviceObj).then(()=>{
                               
                              })
                          }
                          setDeviceHWData(deviceObj);
                          navigation.navigate('HomePage');
                        })
                    }
                }}
             >
                 {/* {console.log(">deviceStatus ",deviceStatus)} */}
              {deviceStatus == "Reading..." || deviceStatus == 'Connected' || deviceStatus=='Ready'?deviceStatus:'Connect'}
            </Button>
    </View>
    <LearnHow modalVisible={modalVisible} setModalVisible={setModalVisible}/>
    </>)
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 10,
    },
    item: {
    //   padding: 20,
      marginVertical: 8,
    //   marginHorizontal: 16,
    },
    title: {
      fontSize: 18,
    },
  });
  