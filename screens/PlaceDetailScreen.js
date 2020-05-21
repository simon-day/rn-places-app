import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapPreview from '../components/MapPreview';
import Colors from '../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import * as placesActions from '../store/places-actions';

const PlaceDetailScreen = (props) => {
  const place = useSelector((state) =>
    state.places.find(
      (place) => place.id === props.navigation.getParam('placeId')
    )
  );

  if (!place) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <Image source={{ uri: place.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{place.address}</Text>
        </View>
        <MapPreview
          style={styles.mapPreview}
          location={{ lat: place.lat, lng: place.lng }}
        />
      </View>
    </ScrollView>
  );
};

PlaceDetailScreen.navigationOptions = (navData) => {
  const title = navData.navigation.getParam('placeTitle');
  const id = navData.navigation.getParam('placeId');
  const imageUri = navData.navigation.getParam('imageUri');

  const dispatch = navData.navigation.getParam('dispatch');

  return {
    headerTitle: title,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Remove Place"
          iconName={
            Platform.OS === 'android' ? 'md-remove-circle' : 'ios-remove-circle'
          }
          onPress={() => {
            Alert.alert('Are you sure?', 'Press OK to remove this place', [
              {
                text: 'OK',
                onPress: () => {
                  dispatch(placesActions.removePlace(id, imageUri));
                  navData.navigation.goBack();
                },
              },
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ]);
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
    backgroundColor: '#ccc',
  },
  locationContainer: {
    marginVertical: 20,
    width: '90%',
    maxWidth: 350,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary,
    textAlign: 'center',
  },
  mapPreview: {
    width: '100%',
    maxWidth: 350,
    height: 300,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default PlaceDetailScreen;
