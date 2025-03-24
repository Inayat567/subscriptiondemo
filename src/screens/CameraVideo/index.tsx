import React, { useState } from 'react';
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
import { createThumbnail } from 'react-native-create-thumbnail';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import { PERMISSIONS, request } from 'react-native-permissions';

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
          [{ text: 'Open Settings', onPress: () => Linking.openSettings() }, { text: 'Cancel' }]
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

      // Define a sanitized file name (no spaces or special characters)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // e.g., 2025-03-25T00-35-29-0500
      const videoFileName = `capturedVideo-${timestamp}.mp4`;
      const videoPath = `${RNFS.DocumentDirectoryPath}/${videoFileName}`;

      // Move the video file
      await RNFS.moveFile(video.path, videoPath);
      console.log('Video moved to:', videoPath);

      // Verify the file exists
      // const fileStat = await RNFS.stat(videoPath);
      // if (!fileStat.isFile()) {
      //   throw new Error('Video file not found after moving');
      // }

      // Set video URI with file:// prefix
      const videoUriWithPrefix = `file://${videoPath}`;
      setVideoUri(videoUriWithPrefix);
      console.log('Video URI set to:', videoUriWithPrefix);

      // Generate thumbnail
      const thumbnail = await createThumbnail({
        url: videoPath, // Plain path works here
        timeStamp: 5000,
        format: 'jpeg',
      });

      const thumbnailFileName = `thumbnail-${timestamp}.jpg`;
      const thumbnailPath = `${RNFS.DocumentDirectoryPath}/${thumbnailFileName}`;
      await RNFS.moveFile(thumbnail.path, thumbnailPath);
      console.log('Thumbnail moved to:', thumbnailPath);

      // Verify thumbnail exists
      // const thumbnailStat = await RNFS.stat(thumbnailPath);
      // if (!thumbnailStat.isFile()) {
      //   throw new Error('Thumbnail file not found after moving');
      // }

      // Set thumbnail URI with file:// prefix
      const thumbnailUriWithPrefix = `file://${thumbnailPath}`;
      setThumbnailUri(thumbnailUriWithPrefix);
      console.log('Thumbnail URI set to:', thumbnailUriWithPrefix);

      Alert.alert('Success', 'Video and thumbnail saved successfully!');
    } catch (error) {
      console.error('Capture/Thumbnail error:', error);
      Alert.alert('Error', `Failed to capture video or generate thumbnail: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={captureVideo}>
        <Text style={styles.buttonText}>Capture Video</Text>
      </TouchableOpacity>

      {thumbnailUri ? (
        <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
      ) : (
        <Text>No thumbnail available</Text>
      )}

      {videoUri ? (
        <Video
          source={{ uri: videoUri }}
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
