import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, TouchableOpacity, Animated, Alert, Text } from 'react-native';
import React, { useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using react-navigation
import { removeItem } from '@/utils/localStorage';
import { LocalStorageKey } from '@/constants/LocalStorageKey';
import { Context } from '../_layout';
import { router } from 'expo-router';


type IconType = 'person-outline' | 'help-circle-outline' | 'log-out-outline';

export default function TabTwoScreen() {
  const menuItems = [
    { name: 'Profile', icon: 'person-outline' },
    { name: 'Help', icon: 'help-circle-outline' },
    { name: 'Logout', icon: 'log-out-outline' },
  ];
  const { state, setState } = useContext(Context);

  const navigation = useNavigation(); // Hook for navigation

  const handlePressIn = (animation: Animated.Value) => {
    Animated.spring(animation, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (animation: Animated.Value) => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleMenuPress = (name: string) => {
    switch (name) {
      case 'Profile':
        // Navigate to Profile screen
        router.push('profile')

        break;
      case 'Help':
        // Navigate to Help screen or perform some action
        // navigation.navigate('HelpScreen');
        router.push('help')
        break;
      case 'Logout':
        removeItem(LocalStorageKey.user)
        setState({ ...state, isLogin: false });
        Alert.alert(
          'Logout',
          'You have been logged out.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Logout canceled'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => router.push('(tabs)')
            },
          ],
          { cancelable: false }
        );
        break;
      default:
        console.log(`${name} pressed`);
    }
  };

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => {
        const animation = useRef(new Animated.Value(1)).current;
        return (
          <Animated.View key={index} style={[styles.menuItem, { transform: [{ scale: animation }] }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn={() => handlePressIn(animation)}
              onPressOut={() => handlePressOut(animation)}
              onPress={() => handleMenuPress(item.name)} // Handle press based on item name
              style={styles.touchable}
            >
              <Ionicons name={item.icon as IconType} size={24} style={styles.icon} />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#F0F2F5',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  icon: {
    marginRight: 16,
    color: '#0A7EA4',
  },
  menuText: {
    fontSize: 18,
    color: '#333333',
  },
});
