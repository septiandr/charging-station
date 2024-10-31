import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors'; // Adjust based on your project color settings
import { SafeAreaView } from 'react-native-safe-area-context';


interface LoginWarningModalProps {
  visible: boolean;
  onLoginPress: () => void;
}

const LoginWarningModal: React.FC<LoginWarningModalProps> = ({ visible, onLoginPress }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        // Prevent closing the modal
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Warning</Text>
          <Text style={styles.modalMessage}>You need to log in first to continue.</Text>
          <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
            <Text style={styles.buttonText}>Log In Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.primary,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.colorSecondaryText,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginWarningModal;