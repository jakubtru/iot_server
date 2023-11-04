import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import axios from 'axios';

import { PrimaryButton } from '../components/PrimaryButton.js';

import { SERVER_PATH } from '../config.js';

export default function Register({ navigation}) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
      <View style={styles.container}>
          <Text style={styles.h2}>Create an account</Text>
          <TextInput 
              style={styles.input}
              placeholder='Email'
              inputMode='email'
              textContentType='emailAddress'
              onChangeText={text => setEmail(text)}
              defaultValue={email}
          />
          <TextInput 
              style={styles.input}
              placeholder='Username'
              onChangeText={text => setUsername(text)}
              defaultValue={username}
          />
          <TextInput 
              style={styles.input}
              placeholder='Password'
              textContentType='password'
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
              defaultValue={password} 
          />
          <PrimaryButton text='Register' onPress={() => RegisterUser(email, username, password, navigation)} />
          <StatusBar style="auto" />  
      </View>
  );
}

const isUsernameValid = (str) => {
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

const isEmailValid = (str) => {
  return String(str)
      .toLowerCase()
      .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

var rand = function() {
  return Math.random().toString(36).substring(2);
};

const getToken = function() {
  return rand() + rand();
};

const RegisterUser = async (email, username, password, navigation) => {
  if (password.length < 6 || !isUsernameValid(username) || !isEmailValid(email)){
      alert("Password must be at least 6 characters long and username must not contain special characters");
      return;
  }

  const newUser = { 
    email: email, 
    password: password, 
    username: username, 
    token: getToken()
  }

  try {
      axios
      .post(SERVER_PATH + '/users', newUser)
      .then(res => {
          alert("Registration successful");
          navigation.navigate('Login');
      })
      .catch(err => console.error(err));

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