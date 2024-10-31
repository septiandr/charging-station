// MapMarker.js

import React from 'react';
import { Marker } from 'react-native-maps';
import { useContext } from 'react';
import { Context } from '@/app/_layout';
import IconChargingLocation from '@/assets/images';

const MapMarker = ({ item, onPressMarker } : any) => {
  const { state, setState } = useContext(Context);

  return (
    <Marker
      coordinate={{
        latitude: item.addressInfo.latitude,
        longitude: item.addressInfo.longitude,
      }}
      onPress={() => {
        setState({ ...state, selectedChargingPoint: item });
        onPressMarker(item);
      }}
    >
      <IconChargingLocation />
    </Marker>
  );
};

export default MapMarker;
