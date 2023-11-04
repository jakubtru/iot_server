import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import axios from 'axios';

import { PrimaryButton } from '../components/PrimaryButton.js';

import { SERVER_PATH } from '../config.js';
import { SecondaryButton } from '../components/SecondaryButton.js';

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.h2}>Login</Text>
            <TextInput 
                style={styles.input}
                placeholder='Username'
                onChangeText={text => setUsername(text)}
                defaultValue={username}
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
                <PrimaryButton text='Login' onPress={() => LoginUser(username, password, navigation)} />
            </View>
            <StatusBar style="auto" />  
        </View>
    );
}

const isUsernameValid = (str) => {
    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

const LoginUser = async (username, password, navigation) => {
    if (password.length < 6 || !isUsernameValid(username)){
        alert("Password must be at least 6 characters long and username must not contain special characters");
        return;
    }

    try {
        const users = await axios
        .get(SERVER_PATH + '/users')
        .then(res => res.data)
        .catch(err => console.error(err));

        const user = users.find(user => user.username === username && user.password === password);
        
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