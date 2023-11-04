import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import axios from 'axios';

import WifiManager from 'react-native-wifi-reborn';

import { PrimaryButton } from '../components/PrimaryButton.js';

import { SERVER_PATH } from '../config.js';
import { SecondaryButton } from '../components/SecondaryButton.js';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [ssid, setSSID] = useState('');

    useEffect(() => {
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
            <Text style={styles.h2}>Login</Text>
            <TextInput 
                style={styles.input}
                placeholder='Email'
                onChangeText={text => setEmail(text)}
                defaultValue={email}
            />
            <TextInput 
                style={styles.input}
                textContentType='password'
                secureTextEntry={true}
                placeholder='Password'
                onChangeText={text => setPassword(text)}
                defaultValue={password} 
            />
            <View style={styles.btnsContainer}>
                <SecondaryButton text="Register "onPress={() => navigation.navigate('Register')}/>
                <PrimaryButton text='Login' onPress={() => LoginUser(email, password, navigation)} />
            </View>
            <Text>SSID: {ssid}</Text>
            <StatusBar style="auto" />  
        </View>
    );
}

const isEmailValid = (str) => {
    return String(str)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
  };

const LoginUser = async (email, password, navigation) => {
    if (password.length < 6 || !isEmailValid(email)){
        alert("Password must be at least 6 characters long and email must be valid");
        return;
    }

    try {
        const users = await axios
        .get(SERVER_PATH + '/users')
        .then(res => res.data)
        .catch(err => console.error(err));

        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            alert("Login successful");
            navigation.navigate('Main', { userID: user.userID });
        } else {
            alert("Wrong username or password");
        }
    } catch (error) {
        console.error(error);
    }
    

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginTop: 20,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '60%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
    },
  });