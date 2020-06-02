import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import * as placesActions from '../store/places-actions';
import ImageSelector from '../components/ImageSelector';
import LocationPicker from '../components/LocationPicker';

const NewPlaceScreen = (props) => {
  const dispatch = useDispatch();
  const [titleValue, setTitleValue] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  const titleChangeHandler = (text) => {
    if (text.trim().length === 0) {
    }

    setTitleValue(text);
  };

  const savePlaceHandler = () => {
    if (!titleValue || !selectedImage || !selectedLocation) {
      Alert.alert(
        'You forgot something!',
        'Add a title, image and location before saving',
        [{ text: 'OK' }]
      );
      return;
    }

    dispatch(
      placesActions.addPlace(titleValue, selectedImage, selectedLocation)
    );
    props.navigation.goBack();
  };

  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const locationPickedHandler = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.titleContainer}>
          <Input
            placeholder="Enter a title"
            autoFocus
            onChangeText={titleChangeHandler}
            value={titleValue}
            style={styles.textInput}
          />
        </View>

        <ImageSelector onImageTaken={imageTakenHandler} />
        <LocationPicker
          navigation={props.navigation}
          onLocationPicked={locationPickedHandler}
        />
        <Button
          title="Save Place"
          type="outline"
          buttonStyle={{
            borderColor: 'tomato',
            marginTop: 20,
            color: 'tomato',
          }}
          titleStyle={{ color: 'tomato' }}
          color={Colors.primary}
          onPress={savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
};

NewPlaceScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Add Place',
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 30,
  },
  titleContainer: {
    marginVertical: 10,
  },
  label: {
    paddingHorizontal: 6,

    fontSize: 18,
    marginBottom: 5,
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    margin: 10,
    paddingHorizontal: 4,
  },
});

export default NewPlaceScreen;
