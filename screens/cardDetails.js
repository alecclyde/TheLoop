import React from 'react';
import { View, Text, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import Card from '../shared/card';
import { MaterialIcons} from '@expo/vector-icons';
import { StackActions } from '@react-navigation/routers';

//Called by favorite and personal when you click on a card to display the content
export default function CardDetails({ navigation, route }) {
  return (
    <View style={globalStyles.container}>
      <Card>
        <View style={globalStyles.rowContainer}>
          <Text style={globalStyles.titleText}>
            { route.params?.name }
          </Text>
            <MaterialIcons onPress={() => navigation.dispatch(StackActions.pop(1))} name='delete' size={25} style={{position: 'absolute', left: 1}}/>
          </View>
        <Text>Address: { route.params?.address }</Text>
        <Text>Creator: { route.params?.creator }</Text>
        <Text>Date and Time: { route.params?.dateTime }</Text>
        <Text>Loop: { route.params?.loop }</Text>
      </Card>
    </View>
  );
}