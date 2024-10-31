import { styles } from "@/app/(tabs)";
import IconChargingLocation from "@/assets/images";
import { Text, View } from "react-native";
import { Marker } from "react-native-maps";

export const renderClusterMarker = ({ id, geometry, onPress, properties }: any) => {
  const points = properties.point_count;

  return (
    <Marker
      key={`cluster-${id}`}
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      tracksViewChanges={false}
      onPress={onPress}
    >
      <View style={styles.markerContainer}>
        <IconChargingLocation />
        <View style={styles.pointContainer}>
          <Text style={styles.pointText}>{points}</Text>
        </View>
      </View>
    </Marker>
  );
};