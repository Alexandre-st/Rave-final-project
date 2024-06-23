import { NavigationProp } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setServerInfo } from '../components/serverInfoSlice';

const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [ip, setIp] = useState<string>('');
  const [port, setPort] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const dispatch = useDispatch();

  const saveServerInfo = () => {
    dispatch(setServerInfo({ ip, port }));
    setIsSaved(true);
    showNotification('Server Info Saved', `IP: ${ip}, Port: ${port}`);
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${ip}:${port}`);
      if (response.ok) {
        setIsConnected(true);
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
      <TextInput
        style={styles.input}
        placeholder='Enter IP address'
        value={ip}
        onChangeText={setIp}
        editable={!isConnected}
      />
      <Text>Port:</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter Port'
        value={port}
        onChangeText={setPort}
        editable={!isConnected}
      />
      {!isConnected && <Button title='Test Connection' onPress={testConnection} />}
      {!isSaved && isConnected ? (
        <Button title='Save Server Info' onPress={saveServerInfo} />
      ) : (
        isSaved && <Text style={styles.successMessage}>Server information saved successfully!</Text>
      )}
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
  successMessage: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default Home;

