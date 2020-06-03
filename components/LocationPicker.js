import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/Colors';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapPreview from '../components/MapPreview';
import { Ionicons } from '@expo/vector-icons';

const LocationPicker = (props) => {
  const [pickedLocation, setPickedLocation] = useState();
  const [initialLocation, setInitialLocation] = useState();
  const [isFetching, setisFetching] = useState(false);

  const mapPickedLocation = props.navigation.getParam('pickedLocation');

  const { onLocationPicked } = props;

  useEffect(() => {
    setInitialCoordsHandler();
  }, []);

  useEffect(() => {
    if (mapPickedLocation) {
      setPickedLocation(mapPickedLocation);
      props.onLocationPicked(mapPickedLocation);
    }
  }, [mapPickedLocation, onLocationPicked]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions',
        'You need to grant location permissions to use this app',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const setInitialCoordsHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      setisFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      setInitialLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map',
        [{ text: 'OK' }]
      );
      setInitialLocation({ lat: 37.78825, lng: -122.4324 });
      //
    }

    // if (!initialLocation) {
    //
    // }

    setisFetching(false);
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      setisFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      props.onLocationPicked({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map',
        [{ text: 'OK' }]
      );
      throw error;
    }
    setisFetching(false);
  };

  const pickOnMapHandler = () => {
    props.navigation.navigate('Map', { gpsLocation: initialLocation });
  };

  return (
    <View style={styles.locationPicker}>
      {pickedLocation && (
        <MapPreview
          style={styles.mapPreview}
          location={pickedLocation}
          onPress={pickOnMapHandler}
        >
          {isFetching ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Text>No location chosen yet</Text>
          )}
        </MapPreview>
      )}
      <View style={styles.actions}>
        <View style={styles.buttonContainer}>
          <Button
            title="Use My Location"
            buttonStyle={{ backgroundColor: Colors.primary, marginRight: 10 }}
            onPress={getLocationHandler}
            icon={
              <Ionicons
                name="ios-compass"
                style={styles.icon}
                size={16}
                color="white"
              />
            }
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            icon={
              <Ionicons
                name="ios-map"
                style={styles.icon}
                size={16}
                color="white"
              />
            }
            title="Select On Map"
            buttonStyle={{ backgroundColor: Colors.primary }}
            onPress={pickOnMapHandler}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15,
    alignItems: 'center',
  },
  mapPreview: {
    marginBottom: 10,
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
  },
  icon: {
    paddingTop: 2,
    paddingRight: 4,
  },
});

export default LocationPicker;
