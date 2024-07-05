import React, { useEffect, useState, useRef, useMemo, useCallback, useContext } from 'react';
import { StyleSheet, Platform, View, FlatList, TextInput, TouchableOpacity, useColorScheme, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking'; // Importing expo-linking
import { LocationMarker } from '@/assets';
import { Context } from '../_layout';
import DATA from '@/assets/data.json'
import { getDataFromOpenChargeMap } from '@/api/api';
import { router } from 'expo-router';
import { ChargingPoint } from '../props';

interface ClusterMarkerProps {
  count: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

interface LocationObject {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

const renderClusterMarker: React.FC<ClusterMarkerProps> = ({ id, geometry, onPress, properties }: any) => {
  const points = properties.point_count;

  return (
    <Marker
      key={`cluster-${id}`}
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      tracksViewChanges={false}
      onPress={onPress}
    >
      <View style={styles.markerContainer}>
        <LocationMarker/>
        <View style={styles.pointContainer}>
          <Text style={styles.pointText}>{points}</Text>
        </View>
      </View>
    </Marker>
  );
};

const haversineDistance = (coords1: any, coords2: any) => {
  const toRad = (x: number) => x * Math.PI / 180;
  const R = 6371; // Radius of the Earth in km

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<number>();
  const [showList, setShowList] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<LocationObject[]>([]);
  const {state, setState} = useContext(Context)
  const [listLocations, setListLocations] = useState<LocationObject[]>([])
  const [responseLocations, setResponseLocations] = useState<ChargingPoint[]>([])

  const mapRef = useRef<any>(null);


  useEffect(()=>{
    if(state.isClickLocation){
      mapRef?.current?.animateToRegion({
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  },[state.isClickLocation])

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      const updatedLocations = listLocations.map((loc: LocationObject) => ({
        ...loc,
        distance: haversineDistance(location.coords, { latitude: loc.latitude, longitude: loc.longitude }),
      })).sort((a, b) => a.distance! - b.distance!);
      setFilteredLocations(updatedLocations);
    }
  }, [location, searchQuery, showList]);

  const theme = useColorScheme() ?? 'light';

  const handleLocationSelect = (loc: LocationObject) => {
    mapRef?.current?.animateToRegion({
      latitude: loc.latitude,
      longitude: loc.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
  };

  const handleNavigateToLocation = (loc: LocationObject) => {
    const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    const url = `${scheme}${loc.latitude},${loc.longitude}?q=${loc.latitude},${loc.longitude}`;

    Linking.openURL(url);
  };

  const toggleListVisibility = () => {
    setShowList(!showList);
  };

  useEffect(()=>{
    getDataFromOpenChargeMap().then((data) => {
      if (data) {
        const list = data?.map((item : any) =>{
          return {
            latitude : item.AddressInfo.Latitude,
            longitude: item.AddressInfo.Longitude,
            id: item.ID,
            name:item.AddressInfo.Title
          }
        })
        setResponseLocations(data)
        setListLocations(list)
      } else {
          console.log('Gagal mendapatkan data dari API OpenChargeMap.');
      }
    })
    },[])

const memoizedMarkers = useMemo(() => {
  return listLocations?.map((item :LocationObject) => {
    const selectedLocation = responseLocations.find((loc: ChargingPoint) => loc?.ID === item?.id);

    const onPressMarker =()=>{
      setSelectedLocation(item.id)
      setState({...state, selectedChargingPoint:selectedLocation})
      router.push('location-detail')
    }
    return (
      <Marker
        key={item.id}
        coordinate={{
          latitude: item.latitude,
          longitude: item.longitude,
        }}
        onPress={onPressMarker}
      >
        <LocationMarker />
      </Marker>
    );
  });
}, [listLocations]);


  const renderLocationList =()=>{
    const listSearchLocation = filteredLocations.filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || [])
    if(listSearchLocation.length > 0){
      return(
        <FlatList
        style={{ height: '40%' }}
        data={listSearchLocation}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => handleLocationSelect(item)} style={styles.listItem}>
              <Ionicons name="location-outline" size={24} color={Colors[theme].text} />
              <ThemedText style={styles.listText}>{item.name} - {item.distance?.toFixed(2)} km</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigateToLocation(item)} style={styles.navigateButton}>
              <Ionicons name="navigate-outline" size={24} color={Colors[theme].text} />
              <ThemedText style={styles.listText}>Navigate</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        />
      )
    }else{
      return(
        <ThemedView>
          <ActivityIndicator size={20}/>
        </ThemedView>
      )
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            renderCluster={renderClusterMarker}
            style={{ flex: 1 }}
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
          <ThemedText style={styles.loadingText}>Loading location ....</ThemedText>
        )}
      </View>
      {showList && (
        <View style={styles.listContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors[theme].text} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              placeholderTextColor="#ccc"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {renderLocationList()}
        </View>
      )}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleListVisibility}>
        <Ionicons name={showList ? 'chevron-down' : 'chevron-up'} size={24} color={Colors[theme].text} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
    flex: 1,
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
    left: 2,
    bottom: 40,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  pointText: {
    fontSize: 12,
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
