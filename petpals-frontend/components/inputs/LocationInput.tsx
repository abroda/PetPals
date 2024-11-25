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
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import axios from "axios";
import { reverseGeocodeAsync } from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { ThemedTextField } from "./ThemedTextField";

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

export function LocationInput({
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
}: LocationInputProps) {
  const [region, setRegion] = useState({
    latitudeDelta: initialDelta,
    longitudeDelta: initialDelta,
    ...initialLocation,
  } as Region);
  const [name, setName] = useState<string | undefined>(
    initialLocation.name ?? ""
  );
  const [input, setInput] = useState<string | undefined>(
    initialLocation.name ?? ""
  );
  const [animating, setAnimating] = useState(false);
  const [nameIsLoading, setNameIsLoading] = useState(
    initialLocation.name ? true : false
  );
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
        console.log(place.name + " " + maxScore);

        if (maxScore > placeScore) {
          placeName = place.name;
          placeScore = maxScore;
          console.log(placeName + " " + placeScore);
        }
      }
    );

    const findByType = (types: string[]) => {
      const component = addressComponents.find((elem) =>
        elem.types.some((type: string) => types.includes(type))
      );
      return component ? component.long_name : "";
    };

    let street =
      findByType(["street_address", "route"]) +
      (findByType(["street_number"])
        ? " " + findByType(["street_number"])
        : "");
    let neighborhood = findByType([
      "neighborhood",
      "sublocality_level_1",
      "colloquial_area",
    ]);

    if (!placeName && !street && !neighborhood) {
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
    setNameIsLoading(true);
    setName(newRegion.latitude + ", " + newRegion.longitude);

    await Geocoder.from(region)
      .then((response) => {
        if (response.results.length > 0) {
          formatAddress(
            response.results[0].address_components,
            response.results[0].formatted_address
          ).then((res) => setName(res));
        }
        setNameIsLoading(false);
      })
      .catch((error) => {
        setNameIsLoading(false);
        console.error("Error in Geocoding:", error);
      });
  };

  useEffect(() => {
    getLocationName(region);
  }, []);

  const getLocationCoordinates = async (address: string) => {
    await Geocoder.from(address)
      .then((response) => {
        console.log(JSON.stringify(response));

        if (response.results.length > 0) {
          let newRegion = {
            latitude: response.results[0].geometry.location.lat,
            longitude: response.results[0].geometry.location.lng,
            latitudeDelta: initialDelta,
            longitudeDelta: initialDelta,
          } as Region;

          setAnimating(true);
          mapRef.current?.animateToRegion(newRegion, 1000);
          setTimeout(() => setAnimating(false), 1000);
        }
        setNameIsLoading(false);
      })
      .catch((error) => {
        setNameIsLoading(false);
        console.error("Error in Geocoding:", error);
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
            pinColor={useThemeColor("alarm")}
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
}
