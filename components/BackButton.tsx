import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton: React.FC = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
      <MaterialIcons name="arrow-back" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute', // Mengatur posisi absolut
    top: 25, // Jarak dari atas layar
    left: 0, // Jarak dari kiri layar
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0000', // Sedikit transparan agar terlihat menarik
    borderRadius: 5, // Membuat sudut tombol melengkung
  },
  backButtonText: {
    color: '#ffff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default BackButton;
