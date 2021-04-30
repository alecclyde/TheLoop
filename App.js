import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Logo from "./assets/The_Loop.jpg"

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.textFontSize}>Hello, world!</Text>
      <StatusBar style="auto" />
      <img src={Logo} alt="The Loop Logo" height={500} width={500} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textFontSize: {
    fontSize: 48,
  }
});
