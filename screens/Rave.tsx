import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Rave: React.FC = () => {
  const recordings = useSelector((state: RootState) => state.recordings.recordings);

  const sendRecording = async (fileName: string) => {
    const fileUri = `${FileSystem.documentDirectory}recordings/${fileName}`;
    const serverUrl = 'http://your-server-ip:your-server-port/upload'; // Remplacez par les détails de votre serveur

    let formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'audio/m4a',
    } as any);

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        showNotification('Upload Successful!', 'Your recording has been successfully uploaded.');
      } else {
        showNotification('Upload Failed!', 'Failed to upload the recording.');
      }
    } catch (error) {
      console.error('Upload Error', error);
      showNotification('Upload Error!', 'An error occurred while uploading the recording.');
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
      <FlatList
        data={recordings}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text>{item}</Text>
            <Button title='Send' onPress={() => sendRecording(item)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default Rave;

// useEffect(() => {
  //   // Vérifier et créer le dossier "recordings" si nécessaire
  //   const ensureRecordingFolderExists = async () => {
  //     const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'recordings');
  //     if (!dirInfo.exists) {
  //       await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings');
  //     }
  //     loadRecordings();
  //   };

  //   ensureRecordingFolderExists();
  // }, []);

  // const loadRecordings = async () => {
  //   const dirInfo = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'recordings');
  //   dirInfo.forEach((file) => {
  //     dispatch(addRecording(file));
  //   });
  // };

  // const startRecording = async () => {
  //   try {
  //     const { status } = await Audio.requestPermissionsAsync();
  //     if (status !== 'granted') {
  //       console.warn('Permission to access microphone was denied');
  //       return;
  //     }

  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
  //       playsInSilentModeIOS: true,
  //       shouldDuckAndroid: true,
  //       interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
  //       playThroughEarpieceAndroid: false,
  //       staysActiveInBackground: true,
  //     });

  //     const recording = new Audio.Recording();
  //     await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
  //     await recording.startAsync();
  //     setRecording(recording);
  //     setIsRecording(true);
  //   } catch (err) {
  //     console.error('Failed to start recording', err);
  //   }
  // };

  // const stopRecording = async () => {
  //   setIsRecording(false);
  //   if (!recording) return;

  //   await recording.stopAndUnloadAsync();
  //   const uri = recording.getURI();
  //   if (uri) saveRecording(uri);
  //   setRecording(null);
  // };

  // const saveRecording = async (uri: string) => {
  //   const newFileUri = `${FileSystem.documentDirectory}recordings/${newRecordingName}.m4a`;
  //   await FileSystem.moveAsync({
  //     from: uri,
  //     to: newFileUri,
  //   });
  //   dispatch(addRecording(newRecordingName));
  //   setNewRecordingName('');
  // };

  // const playRecording = async (uri: string) => {
  //   const soundObject = new Audio.Sound();
  //   try {
  //     await soundObject.loadAsync({ uri });
  //     await soundObject.playAsync();
  //   } catch (error) {
  //     console.error('Error playing sound', error);
  //   }
  // };

  // const deleteRecording = async (fileName: string) => {
  //   await FileSystem.deleteAsync(`${FileSystem.documentDirectory}recordings/${fileName}`);
  //   dispatch(removeRecording(fileName));
  // };
