import React, { useState } from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';

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
        allowsEditing: true,
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
      allowsEditing: true,
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
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.imagePicker}>
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
      <Button
        title="Take Image"
        color={Colors.primary}
        onPress={imagePromptHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
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
});

export default ImageSelector;
