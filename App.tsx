/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect, useRef} from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function App(): JSX.Element {
  const [imagePath, setImagePath] = useState<string>('');
  const devices = useCameraDevices();
  const device = devices.back;

  const camera = useRef<Camera>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    console.log(newCameraPermission);
  };

  if (device == null)
    return (
      <View style={styles.initializingContainer}>
        <Text style={styles.initializingText}>Initializing...</Text>
      </View>
    );

  const takePhoto = async () => {
    if (camera.current) {
      const image = await camera.current.takePhoto();
      console.log(image?.path);
      setImagePath('file://' + image.path);
    }
  };

  const openGallery = async () => {
    launchImageLibrary({mediaType: 'photo'}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log(response.assets?.[0]?.uri);
        setImagePath(response.assets?.[0]?.uri ?? '');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {imagePath !== '' ? (
        <View style={styles.container}>
          <Image
            source={{uri: 'file://' + imagePath}}
            style={styles.imageContainer}
          />
          <TouchableOpacity onPress={() => setImagePath('')}>
            <Text style={styles.resultText}>Take another picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.cameraContainer}>
            <Camera
              ref={camera}
              style={{flex: 1}}
              device={device!}
              isActive={true}
              photo={true}
            />
          </View>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.rectangleButton} onPress={openGallery}>
              <View style={{width: 40, height: 40, borderRadius: 5}}>
                <Icon name="image" size={30} color="#fff" />
              </View>
              <Text style={{color: '#f1f1f1', fontSize: 18}}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={takePhoto}>
              <View style={styles.innerCircle}>
                <Icon name="camera" size={30} color="#333" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  initializingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  initializingText: {
    fontSize: 24,
  },
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  cameraContainer: {
    flex: 0.85,
    backgroundColor: '#f2f2f2',
  },
  optionsContainer: {
    flex: 0.15,
    backgroundColor: '#333',
    paddingLeft: 30,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
  },
  rectangleButton: {
    width: 70,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  innerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
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
