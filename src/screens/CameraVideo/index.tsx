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
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import {PERMISSIONS, request} from 'react-native-permissions';

const VideoCaptureScreen = () => {
  const [videoUri, setVideoUri] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState('');

  // Request iOS permissions
  const requestPermissions = async () => {
    try {
      const cameraGranted = await request(PERMISSIONS.IOS.CAMERA);
      const microphoneGranted = await request(PERMISSIONS.IOS.MICROPHONE);
      const photoLibraryGranted = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (
        cameraGranted !== 'granted' ||
        microphoneGranted !== 'granted' ||
        photoLibraryGranted !== 'granted'
      ) {
        Alert.alert(
          'Permissions Denied',
          'Please enable camera, microphone, and photo library access in Settings.',
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
    if (!hasPermissions) {
      Alert.alert(
        'Permission',
        'Need Camera, Microphone and Media permission',
        [
          {text: 'Allow', onPress: () => Linking.openSettings()},
          {text: 'Cancel'},
        ],
      );
      return;
    }

    try {
      const video = await ImagePicker.openCamera({
        mediaType: 'video',
        durationLimit: 30, // Limit to 30 seconds
        videoQuality: 'high',
        includeBase64: false,
      });

      // Save video to a persistent location
      const videoPath = `${
        RNFS.DocumentDirectoryPath
      }/${new Date().toDateString()}capturedVideo.mp4`;
      await RNFS.moveFile(video.path, videoPath);
      setVideoUri(videoPath);

      // Generate thumbnail
      const thumbnail = await createThumbnail({
        url: videoPath,
        timeStamp: 1000, // Thumbnail at 1 second
        format: 'jpeg',
      });

      // Save thumbnail to a persistent location
      const thumbnailPath = `${
        RNFS.DocumentDirectoryPath
      }/${new Date().toDateString()}thumbnail.jpg`;
      await RNFS.moveFile(thumbnail.path, thumbnailPath);
      setThumbnailUri(thumbnailPath);

      Alert.alert('Success', 'Video and thumbnail saved successfully!');
    } catch (error) {
      console.error('Capture/Thumbnail error:', error);
      Alert.alert(
        'Error',
        `Failed to capture video or generate thumbnail: ${error?.message}`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={captureVideo}>
        <Text style={styles.buttonText}>Capture Video</Text>
      </TouchableOpacity>

      {thumbnailUri && (
        <Image source={{uri: thumbnailUri}} style={styles.thumbnail} />
      )}

      {videoUri && (
        <Video
          source={{uri: videoUri}}
          style={styles.video}
          controls
          resizeMode="contain"
          onError={error => console.error('Video playback error:', error)}
        />
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  thumbnail: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  video: {
    width: 300,
    height: 300,
  },
});

export default VideoCaptureScreen;
