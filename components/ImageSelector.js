import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const ImageSelector = (props) => {
  const [pickedImage, setPickedImage] = useState();

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions',
        'You need to grant camera permissions to use this app',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // useEffect(() => {}, []);

  const selectFromCameraRollHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      let image = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!image.cancelled) {
        setPickedImage(image.uri);
        props.onImageTaken(image.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });

    setPickedImage(image.uri);
    props.onImageTaken(image.uri);
  };

  const imagePromptHandler = () => {
    Alert.alert(
      'Choose an option',
      'Upload an existing photo or take one now',
      [
        {
          text: 'Library',
          onPress: selectFromCameraRollHandler,
        },
        {
          text: 'Use Camera',
          onPress: takeImageHandler,
        },
        Platform.OS === 'ios' && {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.imagePicker}>
      {pickedImage && (
        <TouchableOpacity
          style={styles.imagePreview}
          onPress={imagePromptHandler}
        >
          {!pickedImage ? (
            <Text>No image picked yet.</Text>
          ) : (
            <Image style={styles.image} source={{ uri: pickedImage }} />
          )}
        </TouchableOpacity>
      )}
      <Button
        title=" Select Image"
        buttonStyle={{ backgroundColor: Colors.primary }}
        icon={
          <Ionicons
            name="ios-camera"
            size={25}
            color="white"
            style={styles.icon}
          />
        }
        onPress={imagePromptHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    // alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  icon: {
    marginTop: 2.5,
  },
});

export default ImageSelector;
