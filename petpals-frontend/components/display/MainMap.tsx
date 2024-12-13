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
import {
  MapPosition,
  MarkerData,
  PathVertex,
} from "@/context/RecordWalkContext";
import UserAvatar from "../navigation/UserAvatar";
import { router } from "expo-router";
import { useTextStyle } from "@/hooks/theme/useTextStyle";

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
  groupWalkMarker?: MarkerData;
  nearbyUsers?: MapPosition[];
  otherParticipants?: MapPosition[];
  path?: PathVertex[];
  showingSummary?: boolean;
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
  groupWalkMarker,
  nearbyUsers,
  otherParticipants,
  path,
  showingSummary,
  ...rest
}: MainMapProps) {
  let initialRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: initialDelta,
    longitudeDelta: initialDelta,
  };

  useEffect(() => {
    initialRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: initialDelta,
      longitudeDelta: initialDelta,
    };
  }, [latitude, longitude]);

  const mapRef = useRef<MapView | null>(null);

  const pathColor = useThemeColor("tertiary");

  const getBoundingBox = (path: PathVertex[]) => {
    let minLat = Number.MAX_VALUE;
    let maxLat = -Number.MAX_VALUE;
    let minLng = Number.MAX_VALUE;
    let maxLng = -Number.MAX_VALUE;

    path.forEach((location) => {
      minLat = Math.min(minLat, location.latitude);
      maxLat = Math.max(maxLat, location.latitude);
      minLng = Math.min(minLng, location.longitude);
      maxLng = Math.max(maxLng, location.longitude);
    });

    return { minLat, maxLat, minLng, maxLng };
  };

  const getRegionContainingWalkPath = (path: PathVertex[]) => {
    if (path.length === 0) {
      return {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: minDelta * 1.2, // Add some padding (20%)
        longitudeDelta: minDelta * 1.2, // Add some padding (20%)
      };
    }

    const { minLat, maxLat, minLng, maxLng } = getBoundingBox(path);

    const latitudeDelta = maxLat - minLat;
    const longitudeDelta = maxLng - minLng;

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latitudeDelta * 1.2, // Add some padding (20%)
      longitudeDelta: longitudeDelta * 1.2, // Add some padding (20%)
    };
  };

  const recenter = (newRegion: Region) =>
    mapRef.current?.animateToRegion(
      showingSummary
        ? getRegionContainingWalkPath(path ?? [])
        : {
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
        {groupWalkMarker && (
          <Marker
            title={groupWalkMarker.title}
            description={groupWalkMarker.description}
            coordinate={groupWalkMarker.coordinates}
            pinColor={groupWalkMarker.color}
            style={useTextStyle({ size: "biggerMedium" })}
          />
        )}
        {path && path.length > 0 && (
          <Polyline
            coordinates={path}
            lineDashPattern={[20, 7]}
            strokeColor={pathColor}
            strokeWidth={3}
          />
        )}

        {!showingSummary &&
          nearbyUsers &&
          nearbyUsers.length > 0 &&
          nearbyUsers
            .filter(
              (elem) =>
                !otherParticipants?.map((e) => e.userId).includes(elem.userId)
            )
            .map((elem) => (
              <Marker
                key={elem.userId}
                coordinate={{
                  latitude: elem.latitude,
                  longitude: elem.longitude,
                }}
                onPress={() => router.push(`/user/${elem.userId}`)}
              >
                <UserAvatar
                  size={12}
                  userId={elem.userId}
                  doLink={false}
                  imageUrl={elem.imageUrl ?? undefined}
                />
              </Marker>
            ))}

        {!showingSummary &&
          otherParticipants &&
          otherParticipants.length > 0 &&
          otherParticipants.map((elem) => (
            <Marker
              key={elem.userId}
              coordinate={{
                latitude: elem.latitude,
                longitude: elem.longitude,
              }}
              onPress={() => router.push(`/user/${elem.userId}`)}
            >
              <UserAvatar
                size={12}
                userId={elem.userId}
                doLink={false}
                imageUrl={elem.imageUrl ?? undefined}
                marked
              />
            </Marker>
          ))}
      </MapView>
    </View>
  );
}
