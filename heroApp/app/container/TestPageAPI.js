
import React,{useEffect,useState} from 'react';
import { View , StyleSheet, Text, TextInput as Input,Image, Alert, BackHandler} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { Button, Switch, ProgressBar, Modal, Portal, Provider, TextInput } from 'react-native-paper';
//import {getOperatorAPI, addOperatorAPI, addSessionAPI, addSessionDataAPI, addSprayerAPI} from '../services/apiService';

export default TestPageAPI = () =>{

  return(<>
  <Button style={{marginBottom:10}} icon="account" mode="contained" 
    onPress={() => console.log('Add Operator')}>
    Add Operator
  </Button>

  <Button style={{marginBottom:10}} icon="chart-donut-variant" mode="contained" 
    onPress={() => console.log(' Add Spray Device')}>
    Add Spray Device
  </Button>

  <Button style={{marginBottom:10}}  icon="card-bulleted-outline" mode="contained" onPress={() => console.log('Pressed')}>
    Add Session
  </Button>

  <Button style={{marginBottom:10}}  icon="card-bulleted-outline" mode="contained" onPress={() => console.log('Pressed')}>
    Add Session Data
  </Button>

  <Button style={{marginBottom:10}}  icon="card-bulleted-outline" mode="contained" 
  onPress={() => console.log('Pressed')}>
    Start session (10 sec Interval)
  </Button>

  <Button style={{marginBottom:10}}  icon="card-bulleted-outline" mode="contained" 
  onPress={() => console.log('Pressed')}>
    Stop session (stop Interval)
  </Button>

  <Text>
    Rules: https://hero-api.kesemsolutions.com/api-docs 
    </Text>
    <Text>
      On adding Session: operatorId  and sprayerId must be valid and pre-exist in databasse.
    </Text>
    <Text>
      On adding SessionData: sessionId must be valid and pre-exist in databasse.
    </Text>
    </>)
}