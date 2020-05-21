import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

const MapScreen = (props) => {
  const initialLocation = props.navigation.getParam('initialLocation');
  const readonly = props.navigation.getParam('readonly');
  const homeCoords = props.navigation.getParam('gpsLocation');

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const [region, setRegion] = React.useState({
    latitude: initialLocation ? initialLocation.lat : homeCoords.lat,
    longitude: initialLocation ? initialLocation.lng : homeCoords.lng,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const selectLocationhandler = (event) => {
    if (readonly) {
      return;
    }

    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        'No location selected!',
        'Make sure to select a location before trying to save.',
        [{ text: 'OK' }]
      );
      return;
    }

    props.navigation.navigate('NewPlace', { pickedLocation: selectedLocation });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({ saveLocation: savePickedLocationHandler });
  }, [savePickedLocationHandler]);

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  return (
    <MapView
      style={styles.mapStyle}
      region={region}
      onRegionChangeComplete={setRegion}
      onPress={selectLocationhandler}
    >
      {markerCoordinates && (
        <Marker title="Picked Location" coordinate={markerCoordinates}></Marker>
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = (navData) => {
  const saveFn = navData.navigation.getParam('saveLocation');
  const readonly = navData.navigation.getParam('readonly');

  if (readonly) {
    return;
  }

  return {
    headerRight: () => (
      <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
        <Text style={styles.headerButtonText}>SAVE</Text>
      </TouchableOpacity>
    ),
  };
};

const styles = StyleSheet.create({
  mapStyle: {
    flex: 1,
  },
  headerButton: {
    marginHorizontal: 20,
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? 'white' : Colors.primary,
  },
});

export default MapScreen;
