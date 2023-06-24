import React, { useState, useEffect, useRef } from 'react';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid
} from 'react-native';

import { CameraRoll,SaveToCameraRollOptions } from "@react-native-camera-roll/camera-roll";

function App(): JSX.Element {
  const [imagePath, setImagePath] = useState<string>('');
  const devices = useCameraDevices();
  const device = devices.back;

  const camera = useRef<Camera>(null);

  useEffect(() => {
    checkPermission();
    hasPermission();
  }, []);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    console.log(newCameraPermission);
  };

  if (device == null) {
    return (
      <View>
        <Text>no camera</Text>
      </View>
    );
  }

  async function hasPermission() {
    const permission = Number(Platform.Version) >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
  
  async function savePicture(tag:string) {
    if (Platform.OS === "android" && !(await hasPermission())) {
      return;
    }
  
    CameraRoll.save(tag)
  };

  const takePicture = async () => {
    if (camera.current) {
      const image = await camera.current.takePhoto();
      console.log(image?.path);
      setImagePath('file://' + image.path);
      savePicture('file://' + image.path);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {imagePath !== '' ? (
        <View style={styles.container}>
          <Image source={{ uri: 'file://' + imagePath }} style={styles.imageContainer} />
          <TouchableOpacity onPress={() => setImagePath('')}>
            <Text style={styles.resultText}>Take another picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <Camera ref={camera} style={styles.camera} device={device} isActive={true} photo />
          <TouchableOpacity onPress={takePicture}>
            <View style={styles.clickButton} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  clickButton: {
    width: 80,
    height: 80,
    backgroundColor: '#FF0037',
    borderRadius: 50,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  imageContainer: {
    width: 250,
    height: 300,
    alignSelf: 'center',
    marginTop: 70,
  },
  resultText: {
    alignSelf: 'center',
    marginTop: 20,
    color: '#FF0037',
    fontSize: 20,
  },
});

export default App;
