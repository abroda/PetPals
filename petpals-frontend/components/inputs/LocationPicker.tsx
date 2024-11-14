import React, { useState } from "react";
import { View, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";

const GOOGLE_API_KEY = "AIzaSyCg5sYswxH3xIPAjnpbsMQpKH58U2ePg_M"; // Replace with your Google API key

const LocationPicker = () => {
  const [locationName, setLocationName] = useState<string>("");
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const handleLocationSelect = (data: any, details: any | null) => {
    setLocationName(
      "data: " +
        JSON.stringify(data) +
        "; " +
        "details: " +
        JSON.stringify(details)
    );
    if (details) {
      const { lat, lng } = details.geometry.location;
      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setLocationName(details.name);
    } else {
      setLocationName(data.toString());
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Search for a location"
        onPress={handleLocationSelect}
        fetchDetails={true}
        query={{
          key: GOOGLE_API_KEY,
          language: "en",
        }}
        styles={{
          textInputContainer: {
            width: "100%",
            paddingHorizontal: 10,
            marginTop: 20,
          },
          textInput: {
            height: 44,
            color: "#5d5d5d",
            fontSize: 16,
          },
        }}
      />

      {/* <MapView
        style={{ flex: 1, marginTop: 20 }}
        region={region}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView> */}

      <Text style={{ fontSize: 16, marginVertical: 10, textAlign: "center" }}>
        Selected Location: |{locationName}|
      </Text>
    </View>
  );
};

export default LocationPicker;
