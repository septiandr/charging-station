import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import React, { useRef } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type IconType = 'person-outline' | 'help-circle-outline' | 'time-outline' | 'search-outline' | 'log-out-outline';

export default function TabTwoScreen() {
  const menuItems = [
    { name: 'Profile', icon: 'person-outline' },
    { name: 'Help', icon: 'help-circle-outline' },
    { name: 'Logout', icon: 'log-out-outline' },
  ];

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

  return (
    <ThemedView style={styles.container}>
      {menuItems.map((item, index) => {
        const animation = useRef(new Animated.Value(1)).current;
        return (
          <Animated.View key={index} style={[styles.menuItem, { transform: [{ scale: animation }] }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn={() => handlePressIn(animation)}
              onPressOut={() => handlePressOut(animation)}
              style={styles.touchable}
            >
              <Ionicons name={item.icon as IconType} size={24} style={styles.icon} />
              <ThemedText type="title" style={styles.menuText}>{item.name}</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Start from the top
    paddingHorizontal: 16,
    backgroundColor: '#F0F2F5', // Light background color for modern look
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
    backgroundColor: '#FFFFFF', // White background for items
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  icon: {
    marginRight: 16,
    color: '#007AFF', // Consistent blue color for icons
  },
  menuText: {
    fontSize: 18,
    color: '#333333', // Dark gray color for text
  },
});
