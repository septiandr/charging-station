import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, TextInput, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is imported
import { ColorPrimary, Colors } from '@/constants/Colors';
import { Context } from '@/app/_layout';
import { router } from 'expo-router';
import { Car } from '@/app/profile';
import { getItem } from '@/utils/localStorage';
import { LocalStorageKey } from '@/constants/LocalStorageKey';
import { getFavoriteByid } from '@/api/api'
import { haversineDistance } from '@/utils/heaversineDistance';

interface Location {
  uuid: string;
  addressInfo: {
    title: string;
  };
  distance?: number;
  isRecommended?: boolean;
  isFavorite?: boolean;
}

interface Props {
  filteredLocations: Location[];
  searchQuery: string;
  handleLocationSelect: (location: Location) => void;
  handleNavigateToLocation: (location: any) => void;
  setSearchQuery: (e: string) => void;
  location:any
}

const LocationList = ({ filteredLocations, searchQuery, location, handleLocationSelect, handleNavigateToLocation, setSearchQuery }: Props) => {
  const [filterType, setFilterType] = useState<string>('all'); // State for selected filter type
  const { state } = useContext(Context)
  const selectCar = state.selectedCar
  const [userId, setUserId] = useState('')
  const [favorites, setFavorites] = useState([])
  const user = state.user

  const getDataFromLocalStorage = async () => {
    const user = await getItem(LocalStorageKey.user);

    setUserId(user.$id);
  };

  const getFavorite =async()=>{
    const response = await getFavoriteByid({user_id:userId || user.$id})
    if(response.code == 200){
      setFavorites(response.data.documents)
    }
  }
  useEffect(()=>{
    if(userId || user?.$id){
      getDataFromLocalStorage()
      getFavorite()
    }
  },[userId])
  

  const mergeDataStationsWithDistance = (documents: any, userCoords : any) => {
    return documents.map((doc : any) => {
      // Parse JSON string in data_station to convert it to an object
      const parsedDataStation = JSON.parse(doc.data_station);
    
      // Calculate the real distance using latitude and longitude
      const stationCoords = {
        latitude: parsedDataStation.addressInfo.latitude,
        longitude: parsedDataStation.addressInfo.longitude,
      };
    
      const distance = haversineDistance(userCoords, stationCoords);
    
      // Replace distanceunit with the calculated distance
      parsedDataStation.distance = distance;
    
      // Return only the parsed data_station with updated distance
      return parsedDataStation;
    });
  };
  
  
  const filterRecomendation = (locations: any, selectCar: Car) => {
    // Filter lokasi berdasarkan koneksi yang cocok
    const filteredLocations = locations.filter((location: any) => {
      return location.connections.some((connection: any) => {
        return (
          connection.connectiontypeid == selectCar.connectionType &&
          connection.currenttypeid == selectCar.currentType &&
          connection.powerkw <= selectCar.power  // Pastikan power <= selectCar.power
        );
      });
    });

    // Urutkan lokasi berdasarkan distance (jarak)
    const sortedLocations = filteredLocations.sort((a : any, b: any) => a.distance - b.distance);

    // Ambil 10 lokasi terdekat
    return sortedLocations.slice(0, 10);
  };

  // Function to filter locations based on filterType and searchQuery
  const getFilteredLocations = (): Location[] => {
    const searchLower = searchQuery.toLowerCase();

    let filteredList = filteredLocations.filter(loc =>
      loc.addressInfo?.title.toLowerCase().includes(searchLower)
      );

    if (filterType === 'recommendation') {
      filteredList = filterRecomendation(filteredLocations, selectCar)
    } else if (filterType === 'favorite') {
      const coord ={
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      }
      filteredList = mergeDataStationsWithDistance(favorites,coord)
      console.log("🚀 ~ getFilteredLocations ~ filteredList:", filteredList)
    }

    return filteredList;
  };

  const filteredList = getFilteredLocations();

  // Render filter menu
  const renderMenu = () => (
    <View style={styles.menuContainer}>
      {['all', 'recommendation', 'favorite'].map(type => (
        <TouchableOpacity
          key={type}
          onPress={() => setFilterType(type)}
          style={[styles.menuItem, filterType === type && styles.activeMenuItem]}
        >
          <Text style={styles.menuText}>
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItem = ({ item }: { item: Location }) => (
    <View key={item.uuid}>
      <TouchableOpacity onPress={() => handleLocationSelect(item)} style={styles.listItem}>
        <Ionicons name="location-outline" size={24} color="#fff" />
        <Text style={styles.listText}>{item.addressInfo.title} - {item.distance?.toFixed(2)} km</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigateToLocation(item)} style={styles.navigateButton}>
        <Ionicons name="navigate-outline" size={24} color="#fff" />
        <Text style={styles.navigateText}>Navigate</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderMenu()}
      {filterType !== 'recommendation' && <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.light.text} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      }
      {filterType === 'recommendation' && !selectCar.id &&
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => router.push('profile')} style={{ backgroundColor: ColorPrimary, borderRadius: 5, padding: 10, margin: 10 }}>
            <Text style={{ color: 'white' }}>Select Car</Text>
          </TouchableOpacity>
        </View>
      }
      {filteredList.length > 0 ? (
        <FlatList
          style={styles.list}
          data={filteredList}
          keyExtractor={(item) => item.uuid}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.loadingContainer}>
                {filterType === 'recommendation' && <Text>Car Not Selected</Text>}
                {filterType === 'favorite' && <Text>No Selected Favorite</Text>}
          {/* <ActivityIndicator size="large" color="#0a7ea4" /> */}
        </View>
      )}
    </View>
  );
};

export default LocationList;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full available space
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#0a7ea4',
  },
  menuItem: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007b9e', // A shade darker for menu items
  },
  activeMenuItem: {
    backgroundColor: '#0a9ebf', // Highlight active filter
  },
  menuText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
    backgroundColor: '#ffffff',
  },
  listText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0a7ea4',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: 15,
    backgroundColor: '#0a7ea4',
    borderRadius: 5,
  },
  navigateText: {
    color: '#fff',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
