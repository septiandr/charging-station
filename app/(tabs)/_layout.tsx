import { Tabs } from 'expo-router';
import React,{ useContext, useEffect } from 'react';
import { StyleSheet, View, TouchableHighlight, SafeAreaView } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Context } from '../_layout';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {state, setState} = useContext(Context)

  const handlePressLocation =()=>{
    setState({...state, isClickLocation:true})
    setTimeout(()=>{
          setState({...state, isClickLocation:false})
    },2000)

  }
  // useEffect(()=>{
  //   setState({...state, isClickLocation:false})

  // },[])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="menu"
            options={{
              title: 'Menu',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'grid' : 'grid-outline'} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
      <View style={styles.centerButtonContainer} pointerEvents="box-none">
        <TouchableHighlight style={styles.buttonWrapper} underlayColor={Colors[colorScheme ?? 'light'].tint} onPress={handlePressLocation}>
          <Ionicons 
            name='navigate-circle' 
            color={colorScheme === 'light' ? Colors.light.icon : Colors.dark.icon} 
            size={40} 
          />
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerButtonContainer: {
    position: 'absolute',
    bottom: 20, // Adjust this value to position the button above the tab bar
    alignItems: 'center',
    width: '100%',
    zIndex: 1, // Ensure the button is above the tab bar
    backgroundColor: 'transparent', // Make sure the background is transparent
  },
  buttonWrapper: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
