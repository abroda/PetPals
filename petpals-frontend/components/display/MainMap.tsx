import { Text, TouchableOpacity, View, ViewProps } from "react-native-ui-lib";
import axios from "axios";
import { PROVIDER_GOOGLE } from "react-native-maps/lib/ProviderConstants";
import MapView, {
  LatLng,
  MapViewProps,
  Marker,
  Polygon,
  Polyline,
  Region,
} from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { ThemedButton } from "../inputs/ThemedButton";
import { ThemedText } from "../basic/ThemedText";
import Geocoder from "react-native-geocoding";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { Href, router, useFocusEffect } from "expo-router";
import HorizontalView from "../basic/containers/HorizontalView";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { PathVertex } from "@/context/WalksContext";
import UserAvatar from "../navigation/UserAvatar";
import { Participant } from "@/context/GroupWalksContext";

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
  console.log(latitude + ", " + longitude);
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
          title={"some titl"}
          description={"Some des"}
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }}
        />
        {path && path.length > 0 && (
          <Polyline
            coordinates={path} //, initialRegion as LatLng]}
            lineDashPattern={[20, 7]}
            strokeColor={pathColor}
            strokeWidth={3}
          />
        )}
        {nearbyUsers &&
          nearbyUsers.length > 0 &&
          nearbyUsers.map((elem) => (
            <Marker
              key={elem.userId}
              coordinate={{
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
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
          otherParticipants.map((elem) => (
            <Marker
              key={elem.userId}
              coordinate={{
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
              }}
            >
              <UserAvatar
                size={10}
                userId={elem.userId}
                doLink={true}
                marked
              />
            </Marker>
          ))}
      </MapView>
    </View>
  );
}
