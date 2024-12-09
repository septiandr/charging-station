import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface AddCarModalProps {
  visible: boolean;
  onAdd: (car: Car) => void;
  onCancel: () => void;
}

export interface Car {
  name: string;
  power: string;
  connectionType: number | null;
  currentType: number | null;
}

const connectionType = {
  32: 'CCS (Type 1)',
  25: 'Type 2 (Socket Only)',
  2: 'CHAdeMO',
  33: 'CCS (Type 2)',
  1036: 'Type 2 (Tethered Connector)',
  0: 'Unknown',
};

const currentType = {
  30: 'DC',
  20: 'AC (Three-Phase)',
  10: 'AC (Single-Phase)',
};

const AddCarModal: React.FC<AddCarModalProps> = ({ visible, onAdd, onCancel }) => {
  const [carName, setCarName] = useState<string>("");
  const [carPower, setCarPower] = useState<string>("");
  const [selectedConnectionType, setSelectedConnectionType] = useState<number | null>(null);
  const [selectedCurrentType, setSelectedCurrentType] = useState<number | null>(null);

  const handleAdd = () => {
    if (carName && carPower) {
      const params: Car = {
        name: carName,
        power: carPower,
        connectionType: selectedConnectionType,
        currentType: selectedCurrentType,
      };

      onAdd(params); // Memanggil fungsi onAdd dari props
      setCarName(""); // Reset input setelah penambahan
      setCarPower("");
      setSelectedConnectionType(null);
      setSelectedCurrentType(null);
    }
  };

  const connectionItems = Object.entries(connectionType).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  const currentItems = Object.entries(currentType).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Car</Text>

          <Text>Car Merk :</Text>
          <TextInput
            placeholder="Car Name"
            style={styles.input}
            value={carName}
            onChangeText={setCarName}
          />
          <Text>Power :</Text>
          <TextInput
            placeholder="Power (kW)"
            style={styles.input}
            keyboardType="numeric"
            value={carPower}
            inputMode='numeric'
            onChangeText={setCarPower}
          />

          <Text>Select Connection Type:</Text>
          <RNPickerSelect
            onValueChange={setSelectedConnectionType}
            items={connectionItems}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
            }}
          />

          <Text>Select Current Type:</Text>
          <RNPickerSelect
            onValueChange={setSelectedCurrentType}
            items={currentItems}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
            }}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleAdd}>
              <Text style={[styles.modalButtonText, { color: '#fff' }]}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: 'red' }]}
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCarModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
