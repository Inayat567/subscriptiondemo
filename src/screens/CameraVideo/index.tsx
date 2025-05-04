import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import VideoPlayer from 'react-native-media-console';
import {PERMISSIONS, request} from 'react-native-permissions';

const VideoCaptureScreen = () => {
  const [videoUri, setVideoUri] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState('');

  // Request iOS permissions
  const requestPermissions = async () => {
    try {
      const cameraGranted = await request(PERMISSIONS.IOS.CAMERA);
      const microphoneGranted = await request(PERMISSIONS.IOS.MICROPHONE);

      if (
        cameraGranted !== 'granted' ||
        microphoneGranted !== 'granted'
      ) {
        Alert.alert(
          'Permissions Denied',
          'Please enable camera and microphone access in Settings.',
          [
            {text: 'Open Settings', onPress: () => Linking.openSettings()},
            {text: 'Cancel'},
          ],
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', 'Failed to request permissions.');
      return false;
    }
  };

  // Launch camera and capture video
  const captureVideo = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const video = await ImagePicker.openCamera({
        mediaType: 'video',
        durationLimit: 30,
        videoQuality: 'high',
        includeBase64: false,
      });
      console.log('created video detail : ', video);

      setVideoUri(video.path);

      // Generate thumbnail
      const thumbnail = await createThumbnail({
        url: video.path,
        timeStamp: 5000,
        format: 'jpeg',
      });
      console.log('created thumbnail detail : ', thumbnail);
      setThumbnailUri(thumbnail.path);

      Alert.alert('Success', 'Video and thumbnail saved successfully!');
    } catch (error) {
      console.error('Capture/Thumbnail error:', error);
      Alert.alert(
        'Error',
        `Failed to capture video or generate thumbnail: ${error.message}`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={captureVideo}>
        <Text style={styles.buttonText}>Capture Video</Text>
      </TouchableOpacity>

      {thumbnailUri ? (
        <Image source={{uri: thumbnailUri}} style={styles.thumbnail} />
      ) : (
        <Text>No thumbnail available</Text>
      )}

      {videoUri ? (
        <VideoPlayer
          source={{uri: videoUri}}
          style={styles.video}
          controls
          resizeMode="contain"
          onError={error => console.error('Video playback error:', error)}
        />
      ) : (
        <Text>No video available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  thumbnail: {
    flex: 0.3,
    width: 200,
    marginVertical: 10,
  },
  video: {
    flex: 0.6,
    width: 300,
  },
});

export default VideoCaptureScreen;
