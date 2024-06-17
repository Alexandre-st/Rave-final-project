import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addRecording, removeRecording } from '../components/recordingSlice';
import { RootState } from '../store';

const Record: React.FC = () => {
  const recordings = useSelector((state: RootState) => state.recordings.recordings);
  const dispatch = useDispatch();
  // const [recording, setRecording] = useState<Audio.Recording | null>(null);
  // const [isRecording, setIsRecording] = useState<boolean>(false);
  const [newRecordingName, setNewRecordingName] = useState<string>('');
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const startRecording = async () => {
    try {
      // Demander la permission d'accéder au micro
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        await requestPermission();
      }
      // Autoriser enregistrement iOS
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: true,
      });
      // Commencer l'enregistrement
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      console.error(err);
    }
  }

   const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    if (uri) setRecordingUri(uri);
    setRecording(null);
  }

  async function playRecording() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
    setSound(sound);
    console.log('Playing sound...');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          // Libérer la mémoire allouée à l'audio précédent
          console.log('Unloading sound...');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function changeRecordingStatus() {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    setIsRecording(!isRecording);
  }

  async function handlePressOut() {
    // Si on enregistrait, on arrête
    // Sinon, on ne fait rien
    if (isRecording) {
      changeRecordingStatus();
    }
  }

  const deleteRecording = async (fileName: string) => {
    await FileSystem.deleteAsync(`${FileSystem.documentDirectory}recordings/${fileName}`);
    dispatch(removeRecording(fileName));
  };

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      <TextInput
        style={styles.input}
        placeholder='Recording Name'
        value={newRecordingName}
        onChangeText={setNewRecordingName}
      />
      <FlatList
        data={recordings}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text>{item}</Text>
            <Button title='Play' onPress={() => playRecording()} />
            <Button title='Delete' onPress={() => deleteRecording(item)} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default Record;

