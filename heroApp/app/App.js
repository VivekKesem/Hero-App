import * as React from 'react';
import { View, StatusBar, NativeModules, NativeEventEmitter ,SafeAreaView,StyleSheet, Alert, TouchableHighlight,TouchableOpacity, Modal, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TestPageAPI from './container/TestPageAPI';
import HomePage from './container/HomePage';
import OfflineSync from './container/OfflineSync';
import SettingPage from './container/SettingPage';
import Profile from './container/OperatorProfile';
import SessionDetail from './container/SessionDetail';
import EditSession from './container/EditSession';
import DeviceConnection from './container/DeviceConnection';
import BleAppManager from './container/BleAppMananger';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Text,Button ,IconButton} from 'react-native-paper';
import RinseProcess from './container/RinseProcessScreens';
import { EventRegister } from 'react-native-event-listeners';
import { initDB } from './services/DBService';
import Material from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import KeepAwake from 'react-native-keep-awake';
import AppCtx from './AppContext'
import { disableInterval ,getIsDeviceConnected } from './services/BleService';
import {delLastIncompleteSession} from './services/DBService';

const Stack = createStackNavigator();
const SelectCameraModal = ({modalVisible,setModalVisible}) => {
  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        }}>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          backgroundColor: 'rgba(100,100,100, 0.5)',
          padding: 40,
        }}>
          <View style={styles.modalView}>
           <AwesomeIcon name="camera" size={29} color="red" />
            <Text style={[styles.modalText]}>Select from photos or camera.</Text>
          <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:35,marginBottom:15}}>
            <TouchableOpacity
              style={{ ...styles.openButton,backgroundColor: "#fff",marginRight:10 ,borderColor:'#012554',borderWidth:1}}
              onPress={() => {
                setModalVisible(!modalVisible);
                setTimeout(()=>{
                  EventRegister.emit('OPEN_CAMERA', { cmd: 'openPhoto' });
                },350);
              }}>
              <Text style={[styles.textStyle,{color:'#012554'}]}>Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#012554" }}
              onPress={() => {
                setModalVisible(!modalVisible);
                setTimeout(()=>{
                  EventRegister.emit('OPEN_CAMERA', { cmd: 'camera' });
                },350);
              }}>
              <Text style={styles.textStyle}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const MessageModal = ({modalVisible,setModalVisible}) => {
  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}>

      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          backgroundColor: 'rgba(100,100,100, 100)',
          padding: 40,
        }}>

          <View style={styles.modalView}>
           <AwesomeIcon name="exclamation-triangle" size={29} color="red"/>
            <Text style={styles.modalText}>Bluetooth is connected.</Text>
            <Text style={[styles.modalText]}>Would you like to disconnect ?</Text>
          <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:35,marginBottom:15}}>
            <TouchableOpacity
              style={{ ...styles.openButton,backgroundColor: "#fff",marginRight:10 ,borderColor:'#012554',borderWidth:1}}
              onPress={() => {
                EventRegister.emit('BLECMD',{cmd:'doDisconnect'}) 
                setModalVisible(!modalVisible);
              }}>
              <Text style={[styles.textStyle,{color:'#012554'}]}>Disconnect</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#012554" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const BatteryModal = ({modalVisible,setModalVisible, batteryPercent}) => {
  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert("Modal has been closed.");
        }}>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          backgroundColor: 'rgba(100,100,100, 0.5)',
          padding: 40,
        }}>
          <View style={styles.modalView}>
           <AwesomeIcon name="battery-quarter" size={29} color="red" />
            <Text style={styles.modalText}>Scout's battery is less than 10%</Text>
            <Text style={[styles.modalText]}>Please charge or replace the sprayer battery soon.</Text>
          <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:35,marginBottom:15}}>
            <TouchableHighlight
              style={{ ...styles.openButton, width:'80%', backgroundColor: "#fff",marginRight:10 ,borderColor:'#012554',borderWidth:1}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={[styles.textStyle,{color:'#012554'}]}>Dismiss</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
};

function App() {
  const [isRinseStatus, setRinseStatus] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [batteryModalVisible, setBatteryModalVisible] = React.useState(false);
  const [selectCameraVisible, setSelectCameraVisible] = React.useState(false);
  const [alertModal, setAlertModal] = React.useState(false);
  const [rinseModal, setRingseModal] = React.useState(false);
  const [navigation, setNavigation] = React.useState({}); 
  const AlertModal = ({modalVisible,setModalVisible}) => {
    return (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}>
  
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: 'rgba(100,100,100, 0.5)',
            padding: 40,
          }}>
            <View style={styles.modalView}>
              <SimpleLineIcons name="logout" size={30} color={'red'}/>
              <Text style={[styles.modalText,{fontSize:16}]}>Exit without saving ?</Text>
              <Text style={[styles.modalText,{fontSize:16}]}>This session will not be saved.</Text>
            <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:35, marginBottom:15}}>
              <TouchableOpacity
                style={{ ...styles.openButton,backgroundColor: "#fff",marginRight:10 ,borderColor:'#012554',borderWidth:1}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={[styles.textStyle,{color:'#012554'}]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: "#012554",paddingRight:25,paddingLeft:25 }}
                onPress={async () => {
                  disableInterval();
                  EventRegister.emit('StopInterval');
                  KeepAwake.deactivate();
                  setModalVisible(!modalVisible);
                  await delLastIncompleteSession();
                  navigation.navigate('HomePage');
                }}>
                <Text style={styles.textStyle}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const RinseModal = ({ modalVisible,setModalVisible})=>{
    return(  
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}>
  
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: 'rgba(100,100,100, 0.5)',
        padding: 40,
      }}>
        <View style={[styles.modalView,{justifyContent:"space-around"}]}>
          <Text style={styles.modalText}>Finished spraying ?</Text>
          <Text style={[styles.modalText]}>Time to do rinse cycle !</Text>
          <Image style={{height:150,width:150,marginTop:20}} source={require('./asset/spray-icon.png')}/>
        <View style={{flexDirection:"row",marginTop:35,marginBottom:15}}>
          <TouchableOpacity
            style={{ ...styles.openButton,backgroundColor: "#fff",marginRight:10 ,borderColor:'#012554',borderWidth:1}}
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text style={[styles.textStyle,{color:'#012554',}]}>Cancel</Text>
          </TouchableOpacity>
          <Button
          style={{justifyContent:"center",width:"40%",paddingStart:5}}
          color={'#012554'}
           contentStyle={{flexDirection:"row-reverse"}}
           icon={()=><Material 
                     size={25}
                      color={'#fff'}
                      name="keyboard-arrow-right"/>} 
          mode="contained"
          onPress={() => {
            setModalVisible(false);
            navigation.navigate('RinseProcess')
          }}>
            Start
          </Button>
        </View>
      </View>
    </View>
  </Modal>)
  }
  React.useEffect(()=>{
    initDB('sessions').then((res)=>{});
    initDB('sprayers').then((res)=>{});
    initDB('sessionData').then((res)=>{});
    let unsubscribe = EventRegister.addEventListener('BATTERY', (value) => {
      setBatteryModalVisible(true);
     });
     let openCameraOption = EventRegister.addEventListener('SELECT_CAMERA', (value) => {
      setSelectCameraVisible(true);
     });
     let deletePhotoModal = EventRegister.addEventListener('DELETE_PHOTO', (value) => {
      setDeletePhotoModalVisible(true);
     });
     return ()=>{
      EventRegister.removeEventListener(unsubscribe);
      EventRegister.removeEventListener(deletePhotoModal);
      EventRegister.removeEventListener(openCameraOption);
    } 
  },[]);
  if(navigation && navigation.dangerouslyGetState && navigation.dangerouslyGetState().routes &&  navigation.dangerouslyGetState().routes[0].params){
    setRingseModal(true);
  }
  return (
    <>
    <AppCtx.Provider
        value={{
          doChangeRinseStatus: (status) => {
            setRinseStatus(status);
          }
        }}
      >
    <MessageModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
    <BatteryModal modalVisible={batteryModalVisible} setModalVisible={setBatteryModalVisible}/>
    <SelectCameraModal modalVisible={selectCameraVisible} setModalVisible={setSelectCameraVisible}/>
    
    <AlertModal modalVisible={alertModal} setModalVisible={setAlertModal}/>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView></SafeAreaView>
    <RinseModal modalVisible={rinseModal} setModalVisible={setRingseModal}/>
    <BleAppManager/>
    <NavigationContainer>
    <OfflineSync/>  
    <Stack.Navigator initialRouteName="Profile">
    <Stack.Screen name="TestPageAPI" component={TestPageAPI} options={{headerShown: false}}/>
    <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
    <Stack.Screen name="RinseProcess" component={RinseProcess} options={{ headerShown: false }}/>
    <Stack.Screen name="SessionDetail" component={SessionDetail} options={({navigation})=>({ title: 'SCOUT',headerTitleStyle:{fontWeight:"bold",fontSize:25,},headerLeft: ()=>
          <TouchableOpacity onPress={()=>{
              navigation.navigate('HomePage')
              // setAlertModal(true);
          }}>
            <View style={{flexDirection:"row"}}>  
                <Entypo name="chevron-left" size={25} style={{alignSelf:"center"}}/>
               <Text style={{color:"#012554",fontSize:19,textAlign:"center"}}>Back</Text>
            </View>
          </TouchableOpacity>
          })}/>
      <Stack.Screen name="EditSession" component={EditSession} options={({navigation})=>({ title: 'SCOUT',headerTitleStyle:{fontWeight:"bold",fontSize:25,},headerLeft: ()=>
          <TouchableOpacity onPress={()=>{
              navigation.navigate('SessionDetail')
              // setAlertModal(true);
          }}>
            <View style={{flexDirection:"row"}}>  
                <Entypo name="chevron-left" size={25} style={{alignSelf:"center"}}/>
               <Text style={{color:"#012554",fontSize:19,textAlign:"center"}}>Back</Text>
            </View>
          </TouchableOpacity>
          })}/>
    <Stack.Screen name="DeviceConnection" component={DeviceConnection} options={{ title: 'SCOUT', headerTitleStyle:{fontWeight:"bold",fontSize:25,},headerBackTitleVisible:false,headerLeft: ()=> null }}/>
    <Stack.Screen 
          name="SettingPage" 
          component={SettingPage} 
          options={{
          headerBackTitle:'Back',
          headerTitleStyle: {fontSize:24,color:"#012554",fontWeight:"bold",fontStyle:"italic"},
          headerRight:(()=><AwesomeIcon
          onPress={()=>{
            // console.log(">>Click bluetooth");
            // EventRegister.emit('BLE_STATUS',{event:'reqDisconnect'})
          }}
          size={36}
          color='#012554'
          style={{paddingRight:20}}
          name="bluetooth-b"/>
          ),
          headerStyle:{height:80}
        }}/>

      <Stack.Screen name="HomePage" component={HomePage}
        options={({navigation})=>({
          title: "SCOUT",
          headerBackTitleVisible:true,
          headerTitleStyle: {fontSize:25,color:"#012554",fontWeight:"bold"},
          headerLeft: (()=>
          <IconButton
          disabled={isRinseStatus}
            onPress={()=>{
              if(!getIsDeviceConnected()){//go back if connection not ok
                navigation.navigate('DeviceConnection');
              }else{// else use default
                setNavigation(navigation);
                setTimeout(()=>{
                  setRingseModal(true);
                },600)
              }
            }}
           icon={props=><AwesomeIcon 
            size={32}
            color={'#012554'}
            style={{
              transform: [
                { scaleX: -1 }
              ]
            }} 
            name="share-square-o"/>}
          />
          ),
          headerLeftContainerStyle:{paddingLeft:20},
          headerRight:(()=><AwesomeIcon
          onPress={()=>{
              if(!getIsDeviceConnected()){//go back if connection not ok
                navigation.navigate('DeviceConnection');
              }else{// else use default
                setModalVisible(true);
              }
          }}
          size={36}
          // color={'#2C88D9'}
          color='#012554'
          style={{paddingRight:20}}
          name="bluetooth-b"/>
          ),
          headerStyle:{height:80}
       })}/>

      <Stack.Screen 
          name="Dashboard" 
          component={HomePage}
          options={({navigation})=>({
          title: "Dashboard",
          headerBackTitleVisible:true,
          headerTitleStyle: {fontSize:24,color:"#012554",fontWeight:"bold",fontStyle:"italic"},
          headerLeft: (()=>
          <IconButton
          disabled={isRinseStatus}
            onPress={()=>{
              setNavigation(navigation);
              setTimeout(()=>{
                setRingseModal(true);
              },600)
            }}
           icon={props=><AwesomeIcon 
            
            size={32}
            // color={'#2C88D9'}
            color={'#012554'}
            style={{
              transform: [
                { scaleX: -1 }
              ]
            }} 
            name="share-square-o"/>}
          />
          ),
          headerLeftContainerStyle:{ paddingLeft: 20 },
          headerRight:(()=><AwesomeIcon
          onPress={()=>{
            setModalVisible(true);
          }}
          size={36}
          color='#012554'
          style={{paddingRight:20}}
          name="bluetooth-b"/>
          ),
          headerStyle:{height:80}
       })}/>

    <Stack.Screen name="SesstionStart" component={HomePage}
        options={({navigation})=>({
          title: "SCOUT",
          headerBackTitleVisible:true,
          headerTitleStyle: {fontSize:24,color:"#012554",fontWeight:"bold",fontStyle:"italic"},
          headerLeft: (()=>
          <TouchableOpacity onPress={()=>{
            setNavigation(navigation);
            setTimeout(()=>setAlertModal(true),300)
          }}>
            <View style={{flexDirection:"row"}}>  
                <Entypo name="chevron-left" size={25} style={{alignSelf:"center"}}/>
               <Text style={{color:"#012554",fontSize:19,textAlign:"center"}}>Exit</Text>
            </View>
          </TouchableOpacity>
          ),
          headerLeftContainerStyle:{paddingLeft:10},
          headerStyle:{height:50}
       })
       }/>

    <Stack.Screen 
          name="HomePageRinse" component={HomePage}
          options={({navigation})=>({
          title: "Finished Session",
          headerBackTitleVisible:true,
          headerTitleStyle: {fontSize:24,color:"#012554",fontWeight:"bold",fontStyle:"italic"},
          headerLeft: (()=><Ionicons 
          onPress={()=>{
            navigation.navigate('Dashboard');
          }}
          size={32}
          color={'#012554'}
          name="ios-open-outline"/>),
          headerLeftContainerStyle:{paddingLeft:20},
          headerRight:(()=><AwesomeIcon
          onPress={()=>{
           setModalVisible(true);
          }}
          size={36}
          // color={'#2C88D9'}
          color='#012554'
          style={{paddingRight:20}}
          name="bluetooth-b"/>
          ),
          headerStyle:{height:80}
       })}/>
        </Stack.Navigator>  
    </NavigationContainer>
    </AppCtx.Provider>
  </>);
}
export default App;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    
  },
  modalView: {
    margin: 20,
    backgroundColor:"black",
   
    backgroundColor: "white",
    borderRadius: 4,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 4,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginTop: 20,
    textAlign: "center"
  }
});
