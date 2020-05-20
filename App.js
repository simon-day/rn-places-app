import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { StyleSheet, Text, View } from 'react-native';
import PlacesNavigator from './navigation/PlacesNavigator';
import placesReducer from './store/places.reducer';
import { init } from './helpers/db';

init()
  .then(() => {
    console.log('Initialized database');
  })
  .catch((error) => {
    console.log('Initializing database failed');
    console.log(error);
  });

const rootReducer = combineReducers({
  places: placesReducer,
});

const store = createStore(placesReducer, applyMiddleware(thunk));

export default function App() {
  return (
    <Provider store={store}>
      <PlacesNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
