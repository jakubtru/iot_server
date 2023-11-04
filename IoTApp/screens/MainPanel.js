import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import axios from 'axios';

import { SERVER_PATH } from '../config.js';
import { PrimaryButton } from '../components/PrimaryButton.js';

export default function MainPanel({ navigation, route }) {
    const [userID, setUserID] = useState([]);

    const [wifiList, setWifiList] = useState([]); // [ { ssid: 'ssid', bssid: 'bssid', capabilities: 'capabilities', level: 'level', frequency: 'frequency', timestamp: 'timestamp' }
    const [ssid, setSSID] = useState('');

    useEffect(() => {
      setUserID(route.params?.userID);
      permission().then(() =>{
        WifiManager.getCurrentWifiSSID()
        .then(ssid => {
            console.log("Your current SSID: " + ssid);
            setSSID(ssid);
          },() => console.log('Cannot get current SSID'))
          .catch(error => {
            console.log(error);
          }
        );
      }).catch(error => {
        console.log(error);
      }
      );}, []);



    const permission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission is required for Wifi connections",
          message:
            "This app requires access to your location.",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
      } else {
        console.log("Location permission denied");
      }
    }


    return (
        <View style={styles.container}>
        <Text>User id: {userID}</Text>
        <Text>SSID: {ssid}</Text>
        <PrimaryButton text='Logout' onPress={() => navigation.navigate('Login')} />
        <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });