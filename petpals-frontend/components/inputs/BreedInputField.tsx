import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import breedsData from "@/assets/DogBreeds.json";
import {ThemedText} from "@/components/basic/ThemedText";
import items from "ajv/lib/vocabularies/applicator/items";

// @ts-ignore
const BreedInputField = ({ newBreed, setNewBreed, themeColors, percentToDP }) => {
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (newBreed) {
      const filtered = breedsData.breeds.filter((breed) =>
        breed.toLowerCase().includes(newBreed.toLowerCase())
      );
      setFilteredBreeds(filtered);
    } else {
      setFilteredBreeds([]);
    }
  }, [newBreed]);

  const handleSelectBreed = (breed: string) => {
    setNewBreed(breed);
    setShowSuggestions(false);
  };

  return (
    <View style={{ position: "relative", zIndex: 10 }}>
      <TextInput
        style={{
          paddingHorizontal: percentToDP(7),
          paddingVertical: percentToDP(3),
          borderRadius: percentToDP(5),
          borderWidth: 1,
          borderColor: themeColors.secondary,
          color: themeColors.textOnSecondary,
          fontSize: percentToDP(4),
          letterSpacing: 0.5,
          marginBottom: percentToDP(2),
        }}
        value={newBreed}
        maxLength={48}
        onChangeText={(text) => {
          setNewBreed(text);
          setShowSuggestions(true);
        }}
        placeholder="Dog's Breed"
        placeholderTextColor="#AAA"
      />

      {showSuggestions && filteredBreeds.length > 0 && (
        <View
          style={{
            backgroundColor: themeColors.secondary,
            borderRadius: percentToDP(5),
            borderWidth: 2,
            borderColor: themeColors.primary,
            position: "absolute",
            top: percentToDP(12),
            width: "100%",
            maxHeight: percentToDP(50),
            overflow: "hidden",
          }}
        >
            {filteredBreeds.map((breed) => {
                return (
                    <Pressable
                        onPress={() => handleSelectBreed(breed)}
                        style={{
                            padding: percentToDP(2),
                            borderBottomWidth: 0.5,
                            borderBottomColor: themeColors.textOnSecondary,
                        }}
                        key={breed}
                    >
                        <ThemedText backgroundColorName={"transparent"} style={{
                            color: themeColors.textOnSecondary,

                        }}>{breed}</ThemedText>
                    </Pressable>
                )
            })}
        {/*  <FlatList*/}
        {/*    data={filteredBreeds}*/}
        {/*    keyExtractor={(item) => item}*/}
        {/*    renderItem={({ item }) => (*/}
        {/*      <Pressable*/}
        {/*        onPress={() => handleSelectBreed(item)}*/}
        {/*        style={{*/}
        {/*          padding: percentToDP(2),*/}
        {/*          borderBottomWidth: 0.5,*/}
        {/*          borderBottomColor: themeColors.textOnSecondary,*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <ThemedText backgroundColorName={"transparent"} style={{*/}
        {/*          color: themeColors.textOnSecondary,*/}

        {/*        }}>{item}</ThemedText>*/}
        {/*      </Pressable>*/}
        {/*    )}*/}
        {/*  />*/}
        </View>
      )}
    </View>
  );
};

export default BreedInputField;
