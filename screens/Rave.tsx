import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Rave: React.FC = () => {
  const [models, setModels] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  // Get the recordings from the reducer
  const recordings = useSelector((state: RootState) => state.recordings.recordings);
  // Get the server info from the homepage
  const serverInfo = useSelector((state: RootState) => state.serverInfo);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch(`${serverInfo.ip}:${serverInfo.port}/getmodels`);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      setModels(data.models);
      console.log(data.models);

      showNotification('Success', 'Models fetched successfully');
    } catch (error) {
      console.error('Error fetching models', error);
      showNotification('Error', 'Failed to fetch models');
    }
  };

  // To dowloadModel
  const downloadModel = async (modelName: string) => {
    setIsDownloading(true);
    try {
      const uri = `${serverInfo.ip}:${serverInfo.port}/selectModel/${modelName}`;
      const fileUri = `${FileSystem.documentDirectory}${modelName}`;
      const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri);
      showNotification('Download Successful!', `Model ${modelName} downloaded successfully to ${localUri}`);
    } catch (error) {
      console.error('Error downloading model', error);
      showNotification('Download Error', `Failed to download model ${modelName}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const sendRecording = async (fileName: string) => {
    const fileUri = `${FileSystem.documentDirectory}recordings/${fileName}`;
    const serverUrl = `${serverInfo.ip}:${serverInfo.port}/upload`;

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
      <Text style={styles.title}>Available Models</Text>
      <FlatList
        data={models}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.modelItem}>
            <Text>{item}</Text>
            <Button title='Download' onPress={() => downloadModel(item)} disabled={isDownloading} />
          </View>
        )}
      />
      <Text style={styles.title}>Recordings</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modelItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default Rave;
