import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Context } from './_layout'; // Pastikan path sesuai dengan lokasi file ContextProvider Anda

const ChargingStationDetails = () => {
  const { state } = useContext(Context);
  const chargingStation = state.selectedChargingPoint;

  if (!chargingStation) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noStationText}>No Charging Station Selected</Text>
      </View>
    );
  }

  const {
    AddressInfo,
    Connections,
    UsageCost,
  } = chargingStation;

  const {
    AddressLine1,
    AddressLine2,
    Postcode,
    StateOrProvince,
    Title,
    Town,
  } = AddressInfo;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Title}</Text>
      <View style={styles.infoContainer}>
        <Ionicons name="location-outline" size={20} color="#ffffff" style={styles.iconBackground} />
        <Text style={styles.address}>{AddressLine1}</Text>
      </View>
      <Text style={styles.address}>{AddressLine2}</Text>
      <Text style={styles.address}>{Town}, {StateOrProvince} {Postcode}</Text>
      <View style={styles.infoContainer}>
        <Ionicons name="cash-outline" size={20} color="#ffffff" style={styles.iconBackground} />
        <Text style={styles.usageCost}>Cost: {UsageCost}</Text>
      </View>

      <Text style={styles.subTitle}>Connections:</Text>
      <FlatList
        data={Connections}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View style={styles.connection}>
            <View style={styles.infoContainer}>
              <Ionicons name="flash-outline" size={20} color="#6200ea" style={styles.icon} />
              <Text style={styles.connectionText}>Type: {item.ConnectionTypeID}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Ionicons name="battery-charging-outline" size={20} color="#6200ea" style={styles.icon} />
              <Text style={styles.connectionText}>Current Type: {item.CurrentTypeID}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Ionicons name="speedometer-outline" size={20} color="#6200ea" style={styles.icon} />
              <Text style={styles.connectionText}>Power: {item.PowerKW} kW</Text>
            </View>
            <View style={styles.infoContainer}>
              <Ionicons name="grid-outline" size={20} color="#6200ea" style={styles.icon} />
              <Text style={styles.connectionText}>Quantity: {item.Quantity}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#6200ea" style={styles.icon} />
              <Text style={styles.connectionText}>Comments: {item.Comments}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noStationText: {
    fontSize: 18,
    color: '#bb86fc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#bb86fc',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  iconBackground: {
    backgroundColor: '#6200ea',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
  },
  address: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  usageCost: {
    fontSize: 16,
    marginVertical: 10,
    color: '#e0e0e0',
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: '#bb86fc',
    textAlign: 'center',
  },
  connection: {
    padding: 16,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  connectionText: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  icon: {
    marginRight: 10,
  },
});

export default ChargingStationDetails;
