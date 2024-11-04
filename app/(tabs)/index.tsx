import React, { useEffect, useState, useRef, useMemo, useCallback, useContext } from 'react';
import { StyleSheet, Platform, View, FlatList, TextInput, TouchableOpacity, useColorScheme, Text, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Context } from '../_layout';
import {getChargingStation } from '@/api/api';
import { router, useFocusEffect} from 'expo-router';
import IconChargingLocation from '@/assets/images';
import LoginWarningModal from '@/components/modal/LoginWarningModal';
import LocationList from '@/components/LocationList';
import { checkUserLoginStatus } from '@/utils/authhelper';
import { haversineDistance } from '@/utils/heaversineDistance';
import { renderClusterMarker } from '@/components/cluster';
import { openLocationInMap, requestLocationPermission } from '@/utils/locationHelper';
import * as Notifications from 'expo-notifications'; // Import expo-notifications

const { height } = Dimensions.get('window');

interface LocationObject {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const { state, setState } = useContext(Context)
  const [modalLoginWarning, setModalLoginWarning] = useState(false)
  const [chargingStation, setChargingStation] = useState([]);
  const hasFetched = useRef(false);
  const isLogin = state.isLogin

  useFocusEffect(
    useCallback(() => {
      console.log('Hello, I am focused!');
      checkUserLoginStatus(state, setModalLoginWarning)

      return () => {
        console.log('This route is now unfocused.');
      }
    }, [])
  );


  const mapRef = useRef<any>(null);

  useEffect(() => {
    if(!isLogin){
        checkUserLoginStatus(state, setModalLoginWarning)
    }
  }, [])

  const handleLoginPress = () => {
    router.push('login')
    setModalLoginWarning(false)
  }

  useEffect(() => {
    if (state.isClickLocation) {
      mapRef?.current?.animateToRegion({
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  }, [state.isClickLocation])

  const getLocation = async () => {
    const currentLocation = await requestLocationPermission();
    if (currentLocation) setLocation(currentLocation);
  };

  useEffect(() => {
    getLocation()
  }, []);

  useEffect(() => {
    if (location) {
      const updatedLocations = chargingStation.map((loc: any) => ({
        ...loc,
        distance: haversineDistance(location.coords, { 
          latitude: loc?.addressInfo?.latitude, 
          longitude: loc?.addressInfo?.longitude 
        }),
      })).sort((a, b) => a.distance! - b.distance!);
      
      setFilteredLocations(updatedLocations);

      // Check distance for notifications
      updatedLocations.forEach((station) => {
        if (station.distance <= 5) { // If within 5 km
          sendNotification(station);
        }
      });
    }
  }, [location, chargingStation]);

  const sendNotification = async (station: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nearby Charging Station',
        body: `A charging station (${station.addressInfo.title}) is within 5 km from you!`,
        data: { stationId: station.uuid },
      },
      trigger: null,
    });
  };


  const theme = useColorScheme() ?? 'light';

  const handleLocationSelect = (loc: any) => {
    mapRef?.current?.animateToRegion({
      latitude: loc.addressInfo.latitude,
      longitude: loc.addressInfo.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
  };

  const handleNavigateToLocation = (loc: any) => {
    openLocationInMap(loc.addressInfo.latitude, loc.addressInfo.longitude);
  };

  const toggleListVisibility = () => {
    setShowList(!showList);
  };

  useEffect(() => {
    if (hasFetched.current) return; // If already fetched, skip

    const fetchChargingStation = async () => {
      const data = await getChargingStation();
      if (data) {
        setChargingStation(data);
        hasFetched.current = true; // Set ref to true to avoid re-fetch
      }
    };

    fetchChargingStation();
  }, []);


  const memoizedMarkers = useMemo(() => {
    return chargingStation?.map((item: any) => {
      const selectedLocation = chargingStation.find((loc: any) => loc?.uuid === item?.uuid);

      const onPressMarker = () => {
        setState({ ...state, selectedChargingPoint: selectedLocation })
        router.push('location-detail')
      }
      return (
        <Marker
          key={item.uuid}
          coordinate={{
            latitude: item.addressInfo.latitude,
            longitude: item.addressInfo.longitude,
          }}
          onPress={onPressMarker}
        >
          <IconChargingLocation />
        </Marker>
      );
    });
  }, [chargingStation]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            renderCluster={renderClusterMarker}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}  
            initialRegion={{
              latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0420,
            }}
            ref={mapRef}
            showsMyLocationButton={false}
            tracksViewChanges={true}
            rotateEnabled={true}
            loadingEnabled
            showsCompass={false}
            showsTraffic={true}
            showsBuildings={false}
            toolbarEnabled={false}
            showsIndoorLevelPicker={false}
            showsUserLocation={true}>
            {memoizedMarkers}
          </MapView>
        ) : (
          <View style={{ height: height, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <Text style={styles.loadingText}>Loading location ....</Text>
          </View>
        )}
      </View>
      {showList && (
        <LocationList
          handleNavigateToLocation={handleNavigateToLocation}
          handleLocationSelect={handleLocationSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          location={location}
          filteredLocations={filteredLocations} />
      )}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleListVisibility}>
        <Ionicons name={showList ? 'chevron-down' : 'chevron-up'} size={24} color={Colors[theme].text} />
      </TouchableOpacity>
      {!isLogin && <LoginWarningModal visible={modalLoginWarning} onLoginPress={handleLoginPress} />}
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listText: {
    marginLeft: 16,
    fontSize: 16,
  },
  loadingText: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clusterContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0A7EA4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  markerContainer: {
    position: 'relative',
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  pointContainer: {
    position: 'absolute',
    left: 5,
    bottom: 28,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  pointText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
