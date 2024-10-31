// locationHelpers.js

import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted' ? await Location.getCurrentPositionAsync({}) : null;
};

export const openLocationInMap = (latitude: any, longitude: any) => {
  const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
  const url = `${scheme}${latitude},${longitude}?q=${latitude},${longitude}`;
  Linking.openURL(url);
};
