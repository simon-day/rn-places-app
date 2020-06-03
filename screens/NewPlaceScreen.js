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
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  // const [selectedDate, setSelectedDate] = useState()

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [datePicked, setDatePicked] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const closeDatePicker = () => {
    setShow(false);
    setDatePicked(true);
  };

  const titleChangeHandler = (text) => {
    if (text.trim().length === 0) {
    }

    setTitleValue(text);
  };

  const savePlaceHandler = () => {
    if (!titleValue || !selectedImage || !selectedLocation || !date) {
      Alert.alert(
        'You forgot something!',
        'Add a title, image and location before saving',
        [{ text: 'OK' }]
      );
      return;
    }

    dispatch(
      placesActions.addPlace(
        titleValue,
        selectedImage,
        selectedLocation,
        date.toISOString()
      )
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
        <View style={styles.datePicker}>
          <View>
            <Button
              onPress={showDatepicker}
              title={
                datePicked
                  ? moment(date).format(' [Visited] Do MMM YYYY')
                  : ' Select Date Visited'
              }
              buttonStyle={{
                backgroundColor: Colors.primary,
                marginBottom: 10,
              }}
              icon={
                <Ionicons
                  name="ios-calendar"
                  size={25}
                  color="white"
                  style={styles.icon}
                />
              }
            />
          </View>
          {show && (
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onDateChange}
              />
              <Button
                onPress={closeDatePicker}
                title="Done"
                buttonStyle={{
                  backgroundColor: Colors.primary,
                  marginBottom: 10,
                }}
              />
            </View>
          )}
        </View>

        <ImageSelector onImageTaken={imageTakenHandler} />
        <LocationPicker
          navigation={props.navigation}
          onLocationPicked={locationPickedHandler}
        />
        <Button
          title="Save Place"
          buttonStyle={{
            backgroundColor: 'tomato',
            marginTop: 20,
            color: 'white',
          }}
          titleStyle={{ color: 'white' }}
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
    marginVertical: 5,
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    margin: 5,
    paddingHorizontal: 4,
  },
  icon: {
    marginTop: 2.5,
  },
});

export default NewPlaceScreen;
