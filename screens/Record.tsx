import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addRecording, removeRecording } from '../components/recordingSlice';
import { RootState } from '../store';

const Record: React.FC = () => {
  const recordings = useSelector((state: RootState) => state.recordings.recordings);
  const dispatch = useDispatch();
  const [newRecordingName, setNewRecordingName] = useState<string>('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const startRecording = async () => {
    if (!newRecordingName.trim()) {
      Alert.alert('Error', 'Please enter a name for the recording.');
      return;
    }
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
      setIsRecording(true); // Mise à jour de l'état isRecording
    } catch (err) {
      console.error(err);
    }
  };

  const pauseRecording = async () => {
    if (!recording) return;
    try {
      await recording.pauseAsync();
      setIsPaused(true);
    } catch (err) {
      console.error(err);
    }
  };

  const resumeRecording = async () => {
    if (!recording) return;
    try {
      await recording.startAsync();
      setIsPaused(false);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      setIsRecording(false);
      setIsPaused(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      if (uri) {
        const newFileUri = `${FileSystem.documentDirectory}recordings/${newRecordingName}.m4a`;
        await FileSystem.moveAsync({
          from: uri,
          to: newFileUri,
        });
        dispatch(addRecording(newRecordingName));
      }
      setNewRecordingName('');
    } catch (err) {
      console.error(err);
    }
    setRecording(null);
  };

  async function playRecording(uri: string) {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    console.log('Playing sound...');
    await newSound.playAsync();
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

  const deleteRecording = async (fileName: string) => {
    await FileSystem.deleteAsync(`${FileSystem.documentDirectory}recordings/${fileName}.m4a`);
    dispatch(removeRecording(fileName));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Recording Name'
        value={newRecordingName}
        onChangeText={setNewRecordingName}
      />
      <View style={styles.buttonContainer}>
        {isRecording && (
          <TouchableOpacity onPress={isPaused ? resumeRecording : pauseRecording} style={styles.button}>
            <Icon name={isPaused ? 'play' : 'pause'} size={30} color='white' />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={styles.button}>
          <Icon name={isRecording ? 'stop' : 'microphone'} size={30} color='white' />
        </TouchableOpacity>
      </View>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text>{item}</Text>
            <TouchableOpacity
              onPress={() => playRecording(`${FileSystem.documentDirectory}recordings/${item}.m4a`)}
              style={styles.iconButton}
            >
              <Icon name='play' size={20} color='blue' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteRecording(item)} style={styles.iconButton}>
              <Icon name='trash' size={20} color='red' />
            </TouchableOpacity>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 50,
  },
  iconButton: {
    padding: 10,
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default Record;

