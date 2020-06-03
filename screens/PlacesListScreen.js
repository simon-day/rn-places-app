import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Text, Platform, FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import PlaceItem from '../components/PlaceItem';
import * as placesActions from '../store/places-actions';

const PlacesListScreen = (props) => {
  const places = useSelector((state) => state.places);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(placesActions.loadPlaces());
  }, [dispatch]);

  if (places.length === 0) {
    return (
      <View style={styles.noPlaces}>
        <Text>You have no places saved. Begin adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      data={places.sort((a, b) => a.dateVisited < b.dateVisited)}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <PlaceItem
          onSelect={() => {
            props.navigation.navigate('PlaceDetail', {
              placeTitle: itemData.item.title,
              placeId: itemData.item.id,
              imageUri: itemData.item.imageUri,
              dispatch: dispatch,
            });
          }}
          title={itemData.item.title}
          address={itemData.item.address}
          image={itemData.item.imageUri}
          dateVisited={itemData.item.dateVisited}
        />
      )}
    />
  );
};

PlacesListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'All Places',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add Place"
          iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
          onPress={() => {
            navData.navigation.navigate('NewPlace');
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
  },
  noPlaces: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlacesListScreen;
