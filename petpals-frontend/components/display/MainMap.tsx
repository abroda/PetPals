import { View, ViewProps } from "react-native-ui-lib";
import { PROVIDER_GOOGLE } from "react-native-maps/lib/ProviderConstants";
import MapView, {
  MapViewProps,
  Marker,
  Polyline,
  Region,
} from "react-native-maps";
import { useEffect, useRef } from "react";
import Constants from "expo-constants";
import Geocoder from "react-native-geocoding";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { MarkerData, PathVertex } from "@/context/WalksContext";
import UserAvatar from "../navigation/UserAvatar";
import { Participant } from "@/context/GroupWalksContext";

Geocoder.init(Constants.expoConfig?.extra?.googleMapsApiKey);

export type MainMapProps = {
  locationName?: string;
  latitude?: number;
  longitude?: number;
  initialDelta?: number;
  minDelta?: number;
  maxDelta?: number;
  viewStyle?: ViewProps["style"];
  mapProps?: MapViewProps;
  markers?: MarkerData[];
  pins?: MarkerData[];
  nearbyUsers?: (MarkerData & Participant)[];
  otherParticipants?: (MarkerData & Participant)[];
  path?: PathVertex[];
};

export function MainMap({
  locationName = "Wrocław",
  latitude = 51.108592525,
  longitude = 17.038330603,
  initialDelta = 0.012,
  minDelta = 0.001,
  maxDelta = 0.7,
  viewStyle,
  mapProps,
  markers,
  pins,
  nearbyUsers,
  otherParticipants,
  path,
  ...rest
}: MainMapProps) {
  let initialRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: initialDelta,
    longitudeDelta: initialDelta,
  };

  let currentPath = path;

  useEffect(() => {
    console.log(initialRegion);
    initialRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: initialDelta,
      longitudeDelta: initialDelta,
    };
  }, [latitude, longitude]);

  const mapRef = useRef<MapView | null>(null);

  const pathColor = useThemeColor("tertiary");

  const testPath = [
    { latitude: 51.108592525, longitude: 17.038330603, timestamp: new Date() },
    { latitude: 51.108192525, longitude: 17.038330603, timestamp: new Date() },
    { latitude: 51.108192525, longitude: 17.038340603, timestamp: new Date() },
    { latitude: 51.108592525, longitude: 17.038340603, timestamp: new Date() },
  ];

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
        latitude: latitude,
        longitude: longitude,
      },
      1000
    );

  return (
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
        //customMapStyle={} //customize map style, editable in Google Maps Platform console
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        onMapLoaded={() => recenter(initialRegion)}
        onRegionChangeComplete={recenter}
        loadingEnabled
        {...mapProps}
      >
        <Marker
          title={"Your location"}
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }}
        />
        {path && path.length > 0 && (
          <Polyline
            coordinates={
              //   [
              //   {
              //     latitude: 51.108592525,
              //     longitude: 17.038330603,
              //     timestamp: new Date(),
              //   } as PathVertex,
              //   {
              //     latitude: 51.10500525,
              //     longitude: 17.036930603,
              //     timestamp: new Date(),
              //   } as PathVertex,
              //   {
              //     latitude: 51.11020525,
              //     longitude: 17.056930603,
              //     timestamp: new Date(),
              //   } as PathVertex,
              //   ...path,
              // ]
              path.map((elem) => ({
                latitude: elem.latitude,
                longitude: elem.longitude,
                timestamp: elem.timestamp,
              }))
            } //, initialRegion as LatLng]}
            lineDashPattern={[20, 7]}
            strokeColor={pathColor}
            strokeWidth={3}
          />
        )}
        {nearbyUsers &&
          nearbyUsers.length > 0 &&
          // [
          //   ...nearbyUsers,
          //   {
          //     coordinates: {
          //       latitude: 51.108592525,
          //       longitude: 17.038330603,
          //     },
          //     userId: "bac3be56-0e5e-443a-945a-4c493fce170c",
          //   },
          // ]
          nearbyUsers.map((elem) => (
            <Marker
              key={elem.userId}
              coordinate={{
                latitude: elem.coordinates.latitude,
                longitude: elem.coordinates.longitude,
              }}
            >
              <UserAvatar
                size={10}
                userId={elem.userId}
                doLink={true}
              />
            </Marker>
          ))}

        {otherParticipants &&
          otherParticipants.length > 0 &&
          // [
          //   ...otherParticipants,
          //   {
          //     coordinates: {
          //       latitude: 51.1092534,
          //       longitude: 17.048330603,
          //     },
          //     userId: "bac3be56-0e5e-443a-945a-4c493fce170c",
          //   },
          // ]
          otherParticipants.map((elem) => (
            <Marker
              key={elem.userId}
              coordinate={{
                latitude: elem.coordinates.latitude,
                longitude: elem.coordinates.longitude,
              }}
            >
              <UserAvatar
                size={10}
                userId={elem.userId}
                doLink={true}
              />
            </Marker>
          ))}
      </MapView>
    </View>
  );
}
