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
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
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
  locationName: string;
  initialLocation: { latitude: number; longitude: number };
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
  locationName,
  initialLocation,
  initialDelta = 0.012,
  minDelta = 0.001,
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
  const mapRef = useRef<MapView | null>(null);

  const percentToDP = useWindowDimension("shorter");

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
          //customMapStyle={} //customize map style, editable in Google Maps Platform console
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
          {locationName}
        </ThemedText>
      </HorizontalView>
    </View>
  );
}
