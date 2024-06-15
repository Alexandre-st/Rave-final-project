import { NavigationProp } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';

const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [ip, setIp] = useState<string>('');
  const [port, setPort] = useState<string>('');

  const testConnection = async () => {
    try {
      const response = await fetch(`${ip}:${port}`); // http://127.0.0.1:8000 : résultat
      if (response.ok) {
        showNotification('Connection Successful!', 'You have successfully connected to the server.');
      } else {
        showNotification('Connection Failed!', 'Failed to connect to the server.');
      }
    } catch (error) {
      showNotification('Connection Error!', 'An error occurred while trying to connect to the server.');
    }
  };

  const showNotification = (title: string, body: string) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text>Server IP:</Text>
      <TextInput style={styles.input} placeholder='Enter IP address' value={ip} onChangeText={setIp} />
      <Text>Port:</Text>
      <TextInput style={styles.input} placeholder='Enter Port' value={port} onChangeText={setPort} />
      <Button title='Test Connection' onPress={testConnection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default Home;

