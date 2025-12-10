import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface MapViewProps {
  geolocation: string;
  address: string;
}

const PropertyMapView: React.FC<MapViewProps> = ({ geolocation, address }) => {
  // Parse the geolocation string "lat, lng" into coordinates
  const parseGeolocation = (): { latitude: number; longitude: number } | null => {
    try {
      if (!geolocation) return null;

      // Split by comma and trim whitespace
      const [latStr, lngStr] = geolocation.split(',').map(item => item.trim());

      // Convert to numbers
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);

      // Validate the coordinates
      if (isNaN(latitude) || isNaN(longitude)) return null;
      if (latitude < -90 || latitude > 90) return null;
      if (longitude < -180 || longitude > 180) return null;

      return { latitude, longitude };
    } catch (error) {
      console.error('Error parsing geolocation:', error);
      return null;
    }
  };

  const coordinates = parseGeolocation();

  if (!coordinates) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid location data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
      >
        <Marker
          coordinate={coordinates}
          title={address}
          description="Property Location"
          pinColor="#FF5A5F"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
});

export default PropertyMapView;