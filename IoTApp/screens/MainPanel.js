import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

import { SERVER_PATH } from '../config.js';
import { PrimaryButton } from '../components/PrimaryButton.js';

export default function MainPanel({ navigation, route }) {
    const [userID, setUserID] = useState([]);
    useEffect(() => {
      setUserID(route.params?.userID);
    }, []);

    return (
        <View style={styles.container}>
        <Text>User id: {userID}</Text>
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