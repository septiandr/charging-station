import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LocalStorageKey } from '@/constants/LocalStorageKey';
import { getItem } from '@/utils/localStorage';
import { ColorPrimary, Colors } from '@/constants/Colors';
import AddCarModal from '@/components/modal/AddCarModal';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { addCar, deleteCar, getUserCar } from '@/api/api';
import { Context } from './_layout';

export interface Car {
  $id: string;
  name: string;
  power: string;
  connectionType: number | string;
  currentType: number | string;
}

// Lookup tables for connection types and current types
const connectionTypes = {
  32: 'CCS (Type 1)',
  25: 'Type 2 (Socket Only)',
  2: 'CHAdeMO',
  33: 'CCS (Type 2)',
  1036: 'Type 2 (Tethered Connector)',
  0: 'Unknown',
};

const currentTypes = {
  30: 'DC',
  20: 'AC (Three-Phase)',
  10: 'AC (Single-Phase)',
};

export default function App() {
  const { state, setState } = useContext(Context);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [carList, setCarList] = useState<Car[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const selectCar = state.selectedCar
  const [selectedCarId, setSelectedCarId] = useState<string | null>(selectCar.$id);

  const getDataFromLocalStorage = async () => {
    const user = await getItem(LocalStorageKey.user);
    setName(user.name);
    setEmail(user.email);
    setUserId(user.$id);
  };


  const getCar = async () => {
    const response = await getUserCar({ user_id: userId.toString() });
    const combinedCarData = response.data.documents.map((doc: any) => {
      const carData = JSON.parse(doc.car_data);
      carData.$id = doc.$id;
      return carData;
    });
    setCarList(combinedCarData);
  };

  useEffect(() => {
    getDataFromLocalStorage();
  }, []);

  useEffect(() => {
    if (userId) {
      getCar();
    }
  }, [userId]);

  const addCarLocal = async (car: Car) => {
    setModalVisible(false);
    try {
      const payload = { name: car.name, power: car.power, connectionType: car.connectionType, currentType: car.currentType };
      const response = await addCar({ user_id: userId, car_data: JSON.stringify(payload) });
      if (response?.code === 200) {
        getCar();
        Alert.alert('Add Car Successful', `Car: ${car.name}`);
      }
    } catch (error) {
      Alert.alert('Car', error as string);
    }
  };

  const removeCar = async (id: string) => {
    const response = await deleteCar({ id: id });
    if (response.data.code == 200) {
      getCar();
      Alert.alert('Delete car Successful', `Car: ${id}`);
    }
  };

  const handleSelectCar = (id: string) => {
    setSelectedCarId(selectedCarId === id ? null : id);
    const findcar = carList.find((item) => item.$id === id)
    setState({ ...state, selectedCar: findcar });
  };

  const renderCarItem = ({ item }: { item: Car }) => (
    <TouchableOpacity
      onPress={() => handleSelectCar(item.$id)}
      style={[
        styles.carItem,
        { backgroundColor: selectedCarId === item.$id ? Colors.primary : '#fff' }
      ]}
    >
      <View style={{flex:1}}>
        <Text style={styles.carText}>{item.name}</Text>
        <Text style={styles.carPower}>{item.power} kW</Text>
        {/* Display connectionType and currentType */}
        <Text style={styles.carDetail}>
          Connection Type: {connectionTypes[item.connectionType as keyof typeof connectionTypes] || 'Unknown'}
        </Text>
        <Text style={styles.carDetail}>
          Current Type: {currentTypes[item.currentType as keyof typeof currentTypes] || 'Unknown'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeCar(item.$id)} style={styles.deleteButton}>
        <Ionicons name='trash-outline' size={20} color={'white'} />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ position: 'absolute', top: 0, left: 20 }} onPress={() => router.push('/')}>
        <Text>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{name}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.title}>Car List</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name='add-outline' size={15} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={carList}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.$id}
        ListEmptyComponent={<Text style={styles.emptyListText}>Car Not Found</Text>}
      />
      <AddCarModal
        visible={modalVisible}
        onAdd={(e: Car) => addCarLocal(e)}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#000'
  },
  profileContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: ColorPrimary,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    width: 30,
    height: 30,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
  carItem: {
    flexDirection: 'row',
    display:'flex',
    gap:10,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  carText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  carPower: {
    fontSize: 16,
    color: '#666',
  },
  carDetail: {
    fontSize: 14,
    color: '#888',
  },
  deleteButton: {
    paddingVertical: 5,
    backgroundColor: 'red',
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});
