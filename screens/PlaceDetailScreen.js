import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';

const PlaceDetailScreen = (props) => {
  const place = useSelector((state) =>
    state.places.find(
      (place) => place.id === props.navigation.getParam('placeId')
    )
  );
  console.log(place);
  return (
    <View>
      <Text>{place.title}</Text>
    </View>
  );
};

PlaceDetailScreen.navigationOptions = (navData) => {
  const title = navData.navigation.getParam('placeTitle');

  return {
    headerTitle: title,
  };
};

const styles = StyleSheet.create({});

export default PlaceDetailScreen;
