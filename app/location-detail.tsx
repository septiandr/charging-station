import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Context } from './_layout';
import { config } from '@/config/config';
import BackButton from '@/components/BackButton';
import { addToFavorite, deleteFavorite, getFavoriteByid } from '@/api/api';
import { getItem } from '@/utils/localStorage';
import { LocalStorageKey } from '@/constants/LocalStorageKey';

type AddressInfo = {
  id: number;
  title: string;
  addressline1: string;
  town: string;
  stateorprovince: string;
  postcode: string;
  countryid: number;
  latitude: number;
  longitude: number;
  distanceunit: number;
};

type Connection = {
  id: number;
  connectiontypeid: number;
  statustypeid: number;
  levelid: number;
  powerkw: number;
  currenttypeid: number;
  quantity: number;
  comments?: string;
};

type Station = {
  uuid: string;
  usageTypeId: number;
  operatorId: number;
  usageCost: string;
  addressInfo: AddressInfo;
  connections: Connection[];
};

interface Props {
  station: Station;
}

const ChargingStationDetails: React.FC<Props> = () => {
  const { state } = useContext(Context);
  const user = state.user
  const station: Station = state.selectedChargingPoint;
  const primaryColor = '#0A7EA4';
  const [isFavorite, setIsFavorite] = useState(false); // To manage favorite status
  const [favoriteId, setFavoriteId] = useState(''); // To manage favorite statu
  const [userId, setUserId] = useState('')

  const getDataFromLocalStorage = async () => {
    const user = await getItem(LocalStorageKey.user);

    setUserId(user.$id);
  };

  const findMatchingStation = (documents: any, station: any) => {
    return documents.find((doc: any) => {
      setFavoriteId(doc.$id)
      const parsedDataStation = JSON.parse(doc.data_station);
      return parsedDataStation.uuid === station.uuid;
    });
  };


  const getFavorite = async () => {
    const response = await getFavoriteByid({ user_id: userId || user.$id })
    if (response.code == 200) {
      const matchedStation = findMatchingStation(response.data.documents, station);
      if (matchedStation) {
        setIsFavorite(true)
      } else {
        setIsFavorite(false)
      }
    }
  }
  useEffect(() => {
    if (userId || user.$id) {
      getDataFromLocalStorage()
      getFavorite()
    }
  }, [])


  useEffect(() => {
    getDataFromLocalStorage()
  }, [])
  const mapDataStations = (document: any) => {

    const doc = document;

    return {
      addressInfo: {
        title: doc.addressInfo.title,
        latitude: doc.addressInfo.latitude,
        longitude: doc.addressInfo.longitude
      },
      uuid: doc.uuid,
    };
  };


  const handleSaveToFavorites = async () => {
    if(favoriteId && isFavorite){
      const response = await deleteFavorite({id: favoriteId})
      if (response?.code == 200) {
        setFavoriteId('')
        setIsFavorite(false)
        return Alert.alert(
          isFavorite ? 'Removed from Favorites' : 'Saved to Favorites',
          `Station ${station.addressInfo.title} has been ${isFavorite ? 'removed' : 'saved'} to your favorites.`,
        );
      }
    }

    const result = mapDataStations(station);
    const response = await addToFavorite({ user_id: userId, data_station: JSON.stringify(result) })
    if (response.code == 200) {
      setIsFavorite(true)
      setFavoriteId(response.data.$id)
      
      return Alert.alert(
        isFavorite ? 'Removed from Favorites' : 'Saved to Favorites',
        `Station ${station.addressInfo.title} has been ${isFavorite ? 'removed' : 'saved'} to your favorites.`,
      );
    }
    Alert.alert('Failed add favorite',
      ``
    );
    // setIsFavorite(!isFavorite);

  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with station title and location */}
      <View style={styles.header}>
        <BackButton />
        <MaterialIcons name="ev-station" size={30} color="#ffffff" />
        <Text style={styles.title}>{station.addressInfo.title}</Text>
        <Text style={styles.subTitle}>{station.addressInfo.town}, {station.addressInfo.stateorprovince}</Text>
      </View>

      {/* Save to Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleSaveToFavorites}
      >
        <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={24} color={primaryColor} />
        <Text style={styles.favoriteButtonText}>{isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}</Text>
      </TouchableOpacity>

      {/* Operator Section */}
      <View style={styles.section}>
        <MaterialIcons name="account-balance" size={24} color={primaryColor} />
        <Text style={styles.sectionTitle}>Operator</Text>
        <Text style={styles.sectionContent}>
          {config.operator[station.operatorId as keyof typeof config.operator] || 'Unknown Operator'}
        </Text>
      </View>

      {/* Usage Type Section */}
      <View style={styles.section}>
        <MaterialIcons name="people" size={24} color={primaryColor} />
        <Text style={styles.sectionTitle}>Usage Type</Text>
        <Text style={styles.sectionContent}>
          {config.usageType[station.usageTypeId as keyof typeof config.usageType] || 'Unknown Usage Type'}
        </Text>
      </View>

      {/* Usage Cost Section */}
      <View style={styles.section}>
        <MaterialIcons name="attach-money" size={24} color={primaryColor} />
        <Text style={styles.sectionTitle}>Usage Cost</Text>
        <Text style={styles.sectionContent}>{station.usageCost}</Text>
      </View>

      {/* Address Section */}
      <View style={styles.section}>
        <MaterialIcons name="location-on" size={24} color={primaryColor} />
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.sectionContent}>
          {station.addressInfo.addressline1}, {station.addressInfo.postcode}
        </Text>
        <Text style={styles.sectionContent}>
          Latitude: {station.addressInfo.latitude}, Longitude: {station.addressInfo.longitude}
        </Text>
      </View>

      {/* Connections Section */}
      <View style={styles.sectionCon}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="power" size={24} color={'#ffffff'} />
          <Text style={[styles.sectionTitleCon, { color: '#ffffff' }]}>Connections :</Text>
        </View>

        {station.connections.map((connection: Connection, index: number) => (
          <View key={index} style={[styles.connectionCardCon, styles.shadow]}>
            {/* Connection Type */}
            <View style={styles.iconTextRow}>
              <MaterialIcons name="electric-car" size={20} color={primaryColor} />
              <Text style={styles.connectionContentCon}>
                Connection Type: {config.connectionType[connection.connectiontypeid as keyof typeof config.connectionType] || 'Unknown'}
              </Text>
            </View>

            {/* Power */}
            <View style={styles.iconTextRow}>
              <MaterialIcons name="power" size={20} color={primaryColor} />
              <Text style={styles.connectionContentCon}>
                Power (kW): {connection.powerkw} kW
              </Text>
            </View>

            {/* Current Type */}
            <View style={styles.iconTextRow}>
              <MaterialIcons name="flash-on" size={20} color={primaryColor} />
              <Text style={styles.connectionContentCon}>
                Current Type: {config.currentType[connection.currenttypeid as keyof typeof config.currentType] || 'Unknown'}
              </Text>
            </View>

            {/* Status */}
            <View style={styles.iconTextRow}>
              <MaterialIcons name="info" size={20} color={primaryColor} />
              <Text style={styles.connectionContentCon}>
                Status: {config.statusType[connection.statustypeid as keyof typeof config.statusType] || 'Unknown Status'}
              </Text>
            </View>

            {/* Comments */}
            {connection.comments && (
              <View style={styles.iconTextRow}>
                <MaterialIcons name="comment" size={20} color={primaryColor} />
                <Text style={styles.connectionContentCon}>Comments: {connection.comments}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A7EA4',
    padding: 20,
  },
  header: {
    backgroundColor: '#0A7EA4',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subTitle: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 5,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  favoriteButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  section: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#0A7EA4',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  sectionCon: {
    marginBottom: 50,
    marginTop: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleCon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  connectionCardCon: {
    backgroundColor: '#f7f9fb',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectionContentCon: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ChargingStationDetails;
