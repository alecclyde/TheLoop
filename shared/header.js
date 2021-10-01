import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

//Custom Header
export default function Header({ title, navigation }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        {title}
      </Text>
      {/* Menu Icon */}
      {/* <MaterialIcons name='menu' size={28} onPress={} style={styles.icon} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333333',
    letterSpacing: 1,
  },
  icon: {
    color: "#333333",
    position: 'absolute',
    right: 16,
    
  }
});