import * as Location from 'expo-location';
import { Alert } from 'react-native';

export async function startLocationUpdates() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
    }

    // Minta izin untuk background location tracking
    const { granted } = await Location.requestBackgroundPermissionsAsync();
    if (!granted) {
        Alert.alert('Permission to access background location was denied');
        return;
    }

    await Location.startLocationUpdatesAsync('location-task', {
        accuracy: Location.Accuracy.High,
        distanceInterval: 500, // update setiap 500 meter
        deferredUpdatesInterval: 60000, // update minimal setiap 1 menit
        showsBackgroundLocationIndicator: true, // indikator background di iOS
    });
}
