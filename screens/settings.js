import { Text, View,SafeAreaView, } from 'react-native';
import { globalStyles } from "../styles/global";
import React from 'react';

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