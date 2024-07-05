import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, createContext, useState } from 'react';
import 'react-native-reanimated';


import { useColorScheme } from '@/hooks/useColorScheme';
import { ChargingPoint } from './props';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

interface InitialData {
  isClickLocation :boolean
  selectedChargingPoint:ChargingPoint
}


const initialData : InitialData = {
  isClickLocation:false,
  selectedChargingPoint: {
    IsRecentlyVerified: false,
    DateLastVerified: '',
    ID: 0,
    UUID: '',
    DataProviderID: 0,
    OperatorID: 0,
    UsageTypeID: 0,
    UsageCost: '',
    AddressInfo: {
        ID: 0,
        Title: '',
        AddressLine1: '',
        Town: '',
        StateOrProvince: '',
        Postcode: '',
        CountryID: 0,
        Latitude: 0,
        Longitude: 0,
        DistanceUnit: 0
    },
    Connections: [],
    NumberOfPoints: 0,
    StatusTypeID: 0,
    DateLastStatusUpdate: '',
    DataQualityLevel: 0,
    DateCreated: '',
    SubmissionStatusTypeID: 0
  }
};

export const Context = createContext<any>(null);

export default function RootLayout() {
  const [state, setState] = useState<InitialData>(initialData)
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Context.Provider value={{state, setState}}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="location-detail" />
        </Stack>
      </ThemeProvider>
    </Context.Provider>
  );
}
