import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, createContext, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { InitialDataProps, initialData } from './initialValueStore';
import { getItem } from '@/utils/localStorage';
import { LocalStorageKey } from '@/constants/LocalStorageKey';
import { registerForPushNotificationsAsync } from '@/utils/requestPermission';
import { Platform, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { startLocationUpdates } from '@/utils/backgroundFetch';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const Context = createContext<any>(null);

export default function RootLayout() {
  const [state, setState] = useState<InitialDataProps>(initialData)
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    return () => subscription.remove();
  }, []);



  const getDataFromLocalStorage = async () => {
    const user = await getItem(LocalStorageKey.user);
    setState({ ...state, user: user })
  };




  useEffect(() => {
    registerForPushNotificationsAsync()

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

  }, []);

  useEffect(() => {
    getDataFromLocalStorage()
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Context.Provider value={{ state, setState }}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="location-detail" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="help" options={{ headerShown: true }} />
        </Stack>
  </Context.Provider>
  );
}
