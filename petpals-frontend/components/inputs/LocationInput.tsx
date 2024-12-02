import { View, ViewProps } from "react-native-ui-lib";
import { PROVIDER_GOOGLE } from "react-native-maps/lib/ProviderConstants";
import MapView, {
  MapViewProps,
  Marker,
  MarkerDragStartEndEvent,
  Region,
} from "react-native-maps";
import React, { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import { ThemedText } from "../basic/ThemedText";
import Geocoder from "react-native-geocoding";
import { Href, router } from "expo-router";
import HorizontalView from "../basic/containers/HorizontalView";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import axios from "axios";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { ThemedTextField } from "./ThemedTextField";
import ThemedLoadingIndicator from "../decorations/animated/ThemedLoadingIndicator";

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

export type LocationInputProps = {
  initialLocationName: string;
  initialLatitude: number;
  initialLongitude: number;
  onLocationChange: (name: string, lat: number, lng: number) => void;
  onError?: (message: string) => void;
  initialDelta?: number;
  minDelta?: number;
  maxDelta?: number;
  viewStyle?: ViewProps["style"];
  mapProps?: MapViewProps;
};

export function LocationInput({
  initialLocationName,
  initialLatitude,
  initialLongitude,
  onLocationChange,
  onError = (message: string) => {},
  initialDelta = 0.012,
  minDelta = 0.001,
  maxDelta = 0.7,
  viewStyle,
  mapProps,

  ...rest
}: LocationInputProps) {
  const [locationName, setLocationName] = useState(initialLocationName);
  const [region, setRegion] = useState({
    latitudeDelta: initialDelta,
    longitudeDelta: initialDelta,
    latitude: initialLatitude,
    longitude: initialLongitude,
  } as Region);

  const [input, setInput] = useState("");
  const [animating, setAnimating] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  const percentToDP = useWindowDimension("shorter");

  const maxDistance = 1000;
  const placeTypePreference = [
    "establishment",
    "point_of_interest",
    "tourist_attraction",
    "park",
    "public_park",
    "garden",
    "natural_feature",
  ];

  async function formatAddress(
    addressComponents: {
      long_name: string;
      short_name: string;
      types: string[];
    }[],
    formattedAddress: string
  ) {
    let placeName = "";
    let placeScore = -1;

    const placesResponse = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${region.latitude},${region.longitude}`,
          radius: maxDistance,
          key: Constants.expoConfig?.extra?.googleMapsApiKey,
          type: "park",
        },
      }
    );

    placesResponse.data.results.forEach(
      (place: {
        geometry: { location: { lat: number; lng: number } };
        types: any[];
        name: string;
      }) => {
        let distanceScore =
          20 *
          Math.sqrt(
            Math.pow(place.geometry.location.lat - region.latitude, 2) +
              Math.pow(place.geometry.location.lng - region.longitude, 2)
          );

        let maxScore =
          0.01 *
            place.types.reduce(
              (acc: number, type: string) =>
                acc + placeTypePreference.indexOf(type) + 1,
              0
            ) -
          distanceScore;

        if (maxScore > placeScore) {
          placeName = place.name;
          placeScore = maxScore;
        }
      }
    );

    const findByType = (types: string[]) => {
      const component = addressComponents.find((elem) =>
        elem.types.some((type: string) => types.includes(type))
      );
      return component?.long_name;
    };

    let street =
      findByType(["street_address", "route"]) ??
      "" +
        (findByType(["street_number"])
          ? " " + findByType(["street_number"])
          : "");
    let neighborhood = findByType([
      "neighborhood",
      "sublocality_level_1",
      "colloquial_area",
    ]);

    if (placeName.length === 0 && street.length === 0 && !neighborhood) {
      return formattedAddress;
    }

    let city = findByType(["locality", "administrative_level_2"]);
    let sublocality = findByType(["administrative_level_1"]);

    let result = placeName ?? "";
    result += street ? (result.length > 0 ? ", " : "") + street : "";
    result += neighborhood
      ? (result.length > 0 ? ", " : "") + neighborhood
      : "";
    result += city ? (result.length > 0 ? ", " : "") + city : "";
    result += sublocality ? (result.length > 0 ? ", " : "") + sublocality : "";

    return result;
  }

  const getLocationName = async (newRegion: Region) => {
    setLocationName("Loading...");

    await Geocoder.from(region)
      .then((response) => {
        if (response.results.length > 0) {
          formatAddress(
            response.results[0].address_components,
            response.results[0].formatted_address
          ).then((res) => {
            setLocationName(res);
            onLocationChange(res, region.latitude, region.longitude);
          });
        }
      })
      .catch((error) => {
        setTimeout(() => {
          let newName = newRegion.latitude + ", " + newRegion.longitude;
          setLocationName(newName);
          onLocationChange(newName, region.latitude, region.longitude);
        }, 300);
        console.log("Error in Geocoding:", error);
        onError("Unable to fetch location name.");
      });
  };

  const getLocationCoordinates = async (address: string) => {
    let currentName = locationName;
    setLocationName("Loading...");

    await Geocoder.from(address)
      .then((response) => {
        if (response.results.length > 0) {
          let newRegion = {
            latitude: response.results[0].geometry.location.lat,
            longitude: response.results[0].geometry.location.lng,
            latitudeDelta: initialDelta,
            longitudeDelta: initialDelta,
          } as Region;

          formatAddress(
            response.results[0].address_components,
            response.results[0].formatted_address
          ).then((res) => {
            setLocationName(res);
            onLocationChange(res, region.latitude, region.longitude);
          });

          setAnimating(true);
          mapRef.current?.animateToRegion(newRegion, 1000);
          setTimeout(() => setAnimating(false), 1000);
        }
      })
      .catch((error) => {
        setTimeout(() => setLocationName(currentName), 300);
        console.log("Error in Geocoding:", error);
        onError("Unable to fetch the location.");
      });
  };

  return (
    <View>
      <ThemedText
        textStyleOptions={{ weight: "semibold" }}
        style={{ marginBottom: percentToDP(2) }}
      >
        Starting location
      </ThemedText>
      <ThemedTextField
        textStyleOptions={{ size: "small" }}
        value={input}
        placeholder={"Find by name"}
        onEndEditing={(event) => getLocationCoordinates(event.nativeEvent.text)}
        onChangeText={(newText: string) => setInput(newText)}
        trailingAccessory={
          <ThemedIcon
            name="search"
            colorName={"disabled"}
            onPress={() =>
              (input?.length ?? 0) > 0
                ? getLocationCoordinates(input ?? "")
                : {}
            }
            style={{
              marginLeft: percentToDP(-12),
              paddingRight: percentToDP(4),
              paddingTop: percentToDP(1),
            }}
          />
        }
      />
      <View
        style={[
          {
            overflow: "hidden",
            marginTop: percentToDP(4),
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
          initialRegion={region}
          onRegionChangeComplete={async (newRegion: Region) => {
            if (!animating) {
              setRegion(newRegion);
              getLocationName(newRegion);
            }
          }}
          {...mapProps}
        >
          <Marker
            key={"x"}
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />
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
          style={{
            paddingLeft: percentToDP(1),
            paddingRight: percentToDP(2),
            textAlign: "center",
          }}
        >
          {locationName}
        </ThemedText>
      </HorizontalView>
    </View>
  );
}
