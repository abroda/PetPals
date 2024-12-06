import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import {
    widthPercentageToDP,
    heightPercentageToDP,
} from "react-native-responsive-screen";

interface DogTagProps {
    id: string;
    tag: string;
    category: string;
}

const DogTag: React.FC<DogTagProps> = ({ tag }) => {

    // Colours
    const colorScheme = useColorScheme();
    // @ts-ignore
    const themeColors = ThemeColors[colorScheme];

    return (
        <View style={{
            backgroundColor: themeColors.primary,
            borderRadius: widthPercentageToDP(5), // Strongly rounded rectangle
            paddingVertical: widthPercentageToDP(1),
            paddingHorizontal: widthPercentageToDP(1.8),
            alignItems: 'center',
            justifyContent: 'center',
            margin: widthPercentageToDP(0.7),
        }}>
            <Text style={{
                color: themeColors.tertiary,
                fontWeight: 'bold',
                fontSize: widthPercentageToDP(3.4),
                textAlign: 'center',
            }}>#{tag}</Text>
        </View>
    );
};

export default DogTag;
