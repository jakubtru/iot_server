import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

const fetchUsers = async () => {
  const users = await axios
  .get('http://192.168.0.145:3000/users')
  .then(res => res.data)
  .catch(err => console.error(err));
  
  return users;
}

export default function App() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const users = fetchUsers()
      .then(users => setUsers(users));
  }, []);

  return (
    <View style={styles.container}>
      {console.log(users[0])}
      <Text></Text>
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
