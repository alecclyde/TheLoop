import { Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from "../styles/global";

export default function Settings({ navigation }) {
    return (
        <SafeAreaView style={globalStyles.container}>
        <View>
            <Text>
                Settings
            </Text>
        </View>
    </SafeAreaView>
    );
}