import React, { useState } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

const MapScreen = (props) => {
  const [selectedLocation, setSelectedLocation] = useState();

  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //   const mapRegion = {
  //     latitude: 37.78825,
  //     longitude: -122.4324,
  //     latitudeDelta: 0.0922,
  //     longitudeDelta: 0.0421,
  //   };

  const selectLocationhandler = (event) => {
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  //   const onRegionChange = (region) => {
  //     this.setState({ region });
  //   };

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
  return {
    headerRight: () => (
      <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
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
