import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DogTagProps {
    tag: string;
}

const DogTag: React.FC<DogTagProps> = ({ tag }) => {
    return (
        <View style={styles.tagContainer}>
            <Text style={styles.tagText}>#{tag}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tagContainer: {
        backgroundColor: '#1C302A',
        borderRadius: 15, // Strongly rounded rectangle
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2, // Small margin between tags if multiple are displayed in a row
    },
    tagText: {
        color: '#B4D779',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default DogTag;
