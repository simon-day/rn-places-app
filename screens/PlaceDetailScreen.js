import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapPreview from '../components/MapPreview';
import Colors from '../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import * as placesActions from '../store/places-actions';
import ImageView from 'react-native-image-viewing';
import moment from 'moment';

const PlaceDetailScreen = (props) => {
  const [visibleImage, setIsVisibleImage] = useState(false);

  const place = useSelector((state) =>
    state.places.find(
      (place) => place.id === props.navigation.getParam('placeId')
    )
  );

  const selectedLocation = place ? { lat: place.lat, lng: place.lng } : null;

  const showMapHandler = () => {
    props.navigation.navigate('Map', {
      readonly: true,
      initialLocation: selectedLocation,
    });
  };

  const formatDaysSinceVisited = () => {
    const visitedDate = moment(place.dateVisited);
    const today = moment();

    const hoursDiff = today.diff(visitedDate, 'hours');

    if (hoursDiff < 24) {
      return 'Today';
    } else if (hoursDiff < 48) {
      return 'Yesterday';
    } else {
      return `${Math.floor(hoursDiff / 24)} days ago`;
    }
  };

  if (!place) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  const { imageUri } = place;

  let images = [
    {
      uri: imageUri,
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <ImageView
        images={images}
        imageIndex={0}
        visible={visibleImage}
        onRequestClose={() => setIsVisibleImage(false)}
      />
      <TouchableOpacity
        style={styles.image}
        onPress={() => setIsVisibleImage(true)}
      >
        <Image source={{ uri: place.imageUri }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.visitedContainer}>
        <Text style={styles.visitedText}>
          Visited {formatDaysSinceVisited()}
        </Text>
      </View>
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{place.address}</Text>
        </View>
        <MapPreview
          style={styles.mapPreview}
          location={selectedLocation}
          onPress={showMapHandler}
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
                style: 'default',
              },
              {
                text: 'Cancel',
                onPress: () => {
                  return;
                },
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
    // height: '35%',
    minHeight: 300,
    width: '100%',
    backgroundColor: '#ccc',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    // elevation: 5,
  },
  visitedContainer: {
    marginTop: 30,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 30,
    borderColor: '#ccc',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  visitedText: {
    fontSize: 18,
    fontWeight: '200',
  },
  locationContainer: {
    marginVertical: 30,
    width: '100%',
    // maxWidth: 350,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',

    // borderRadius: 10,
  },
  addressContainer: {
    padding: 10,
  },
  address: {
    color: Colors.primary,
    paddingBottom: 5,
    textAlign: 'center',
  },
  mapPreview: {
    width: '90%',
    paddingBottom: 10,
    // maxWidth: 350,
    height: '80%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default PlaceDetailScreen;
