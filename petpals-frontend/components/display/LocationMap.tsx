import { Text, TouchableOpacity, View, ViewProps } from "react-native-ui-lib";
import axios from "axios";
import { PROVIDER_GOOGLE } from "react-native-maps/lib/ProviderConstants";
import MapView, { MapViewProps, Marker, Region } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { ThemedButton } from "../inputs/ThemedButton";
import { ThemedText } from "../basic/ThemedText";
import Geocoder from "react-native-geocoding";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { Href, router } from "expo-router";
import HorizontalView from "../basic/containers/HorizontalView";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

Geocoder.init(Constants.expoConfig?.extra?.googleMapsApiKey);

export type MarkerData = {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  color: string;
  pictureURL: string;
  linksTo: string;
};

export type LocationMapProps = {
  initialLocation: { latitude: number; longitude: number; name?: string };
  initialDelta?: number;
  minDelta?: number;
  maxDelta?: number;
  viewStyle?: ViewProps["style"];
  mapProps?: MapViewProps;
  markers?: MarkerData[];
  pins?: MarkerData[];
  users?: MarkerData[];
  paths?: MarkerData[][];
};

export function LocationMap({
  initialLocation,
  initialDelta = 0.012,
  minDelta = 0.003,
  maxDelta = 0.7,
  viewStyle,
  mapProps,
  markers,
  pins,
  users,
  paths,
  ...rest
}: LocationMapProps) {
  const initialRegion = {
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: initialDelta,
    longitudeDelta: initialDelta,
  };
  const [name, setName] = useState<string | null>(initialLocation.name ?? null);

  const mapRef = useRef<MapView | null>(null);

  const percentToDP = useWindowDimension("shorter");

  const accuracies = [
    "country",
    "administrative_level_1",
    "administrative_level_2",
    "locality",
    "sublocality",
    "neighborhood",
    "colloquial_area",
    "natural_feature",
    "tourtist_attraction",
    "establishment",
    "point_of_interest",
    "public_park",
    "park",
    "garden",
  ];

  const getLocationName = async (location: {
    latitude: number;
    longitude: number;
  }) =>
    await Geocoder.from({
      latitude: location.latitude,
      longitude: location.longitude,
    })
      .then((response) => {
        if (response.results.length > 0) {
          setName(response.results[0].formatted_address);
        }
      })
      .catch((error) => {
        setName(location.latitude + ", " + location.longitude);
        console.error("Error in Geocoding:", error);
      });

  useEffect(() => {
    getLocationName(initialLocation);
  }, []);

  const recenter = (newRegion: Region) =>
    mapRef.current?.animateToRegion(
      {
        latitudeDelta: Math.min(
          Math.max(newRegion.latitudeDelta, minDelta),
          maxDelta
        ),
        longitudeDelta: Math.min(
          Math.max(newRegion.longitudeDelta, minDelta),
          maxDelta
        ),
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
      },
      1000
    );

  return (
    <View>
      <View
        style={[
          {
            overflow: "hidden",
          },
          viewStyle,
        ]}
      >
        <MapView
          ref={mapRef}
          style={[
            {
              width: "100%",
              height: "100%",
            },
            mapProps?.style,
          ]}
          //customMapStyle={} //customize map style, editable in browser
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          onRegionChangeComplete={recenter}
          {...mapProps}
        >
          <Marker
            key={"x"}
            coordinate={{
              latitude: initialLocation.latitude,
              longitude: initialLocation.longitude,
            }}
            pinColor={useThemeColor("alarm")}
          />
          {markers?.map((marker: MarkerData) => (
            <Marker
              key={JSON.stringify(marker)}
              coordinate={{
                latitude: marker.coordinates.latitude,
                longitude: marker.coordinates.longitude,
              }}
              title={marker.title}
              description={marker.description}
              pinColor={marker.color}
              onPress={() =>
                marker.linksTo
                  ? router.push(marker.linksTo as Href<string>)
                  : {}
              }
            />
          ))}
        </MapView>
      </View>
      <HorizontalView
        justifyOption="center"
        colorName="transparent"
      >
        <ThemedIcon
          size={22}
          style={{ marginLeft: percentToDP(-0.7) }}
          name="location"
        />
        <ThemedText
          textStyleOptions={{ size: "small" }}
          backgroundColorName="transparent"
          numberOfLines={1}
          style={{
            paddingLeft: percentToDP(1),
            paddingRight: percentToDP(2),
          }}
        >
          {name}
        </ThemedText>
      </HorizontalView>
    </View>
  );
  //   const [region, setRegion] = useState<Region | null>(null);
  //   const [error, setError] = useState<string | null>(null);

  //   // Replace "YOUR_GOOGLE_MAPS_API_KEY" with your actual API key
  //   const GOOGLE_MAPS_API_KEY =
  //     Constants.expoConfig?.extra?.googleMapsApiKey ?? "YOUR_GOOGLE_MAPS_API_KEY";

  //   // Replace "locationName" with the location you want
  //   const locationName = "Park Skowroni, Wrocław";

  //   const fetchCoordinates = async (location: string) => {
  //     try {
  //       const response = await axios.get(
  //         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //           location
  //         )}&key=${GOOGLE_MAPS_API_KEY}`
  //       );
  //       if (response.data.results.length > 0) {
  //         const { lat, lng } = response.data.results[0].geometry.location;
  //         setRegion({
  //           latitude: lat,
  //           longitude: lng,
  //           latitudeDelta: 0.0001,
  //           longitudeDelta: 0.0001,
  //         });
  //       } else {
  //         setError("Location not found.");
  //       }
  //     } catch (err) {
  //       setError("Failed to fetch coordinates.");
  //     }
  //   };

  //   useEffect(() => {
  //     fetchCoordinates(locationName);
  //   }, []);

  //   if (!region) {
  //     return (
  //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //         <Text>{error || "Loading map..."}</Text>
  //       </View>
  //     );
  //   }

  //   return (
  //     <View
  //       style={[
  //         {
  //           height: heightPercentageToDP(60),
  //           borderRadius: 50,
  //           borderColor: "red",
  //           borderWidth: 10,
  //           overflow: "hidden",
  //           padding: 30,
  //         },
  //         viewProps?.style,
  //       ]}
  //       {...viewProps}
  //     >
  //       <MapView
  //         provider={PROVIDER_GOOGLE}
  //         style={[
  //           {
  //             width: "100%",
  //             height: "100%",
  //             borderColor: "purple",
  //             borderWidth: 2,
  //           },
  //           mapProps?.style,
  //         ]}
  //         region={region}
  //         cacheEnabled={true}
  //         onRegionChangeComplete={setRegion}
  //         {...mapProps}
  //       >
  //         <Marker
  //           coordinate={{
  //             latitude: region.latitude,
  //             longitude: region.longitude,
  //           }}
  //           title={locationName}
  //           description="This is the location you searched for."
  //         />
  //       </MapView>
  //     </View>
  //   );
}
