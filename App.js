import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Img from './assets/The_Loop.jpg'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.textFontSize}>Welcome to, TheLoop!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

class App extends React.Component {
	render() {
		return (
			<div> 
				<center>
					<img src= {Img} alt="pic" />
					<br/> <b> TheLoop </b>
				</center>
			</div>
		)
	}
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

export default App



