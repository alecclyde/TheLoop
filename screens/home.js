import React, { useState, useEffect } from "react";
import { StyleSheet, Text, ImageBackground, View, FlatList, TouchableOpacity } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import * as firebase from 'firebase';


export default function Home({ navigation }) {
    const [events, setEvents] = useState([]);
    const isFocused = useIsFocused();

    //Gets all the events from the database and sets them to the events
    useEffect(() => {
      setEvents([]);
      firebase.firestore().collection('events').get()
      .then((snap) => {
          snap.docs.forEach(doc => {
            if(doc.exists) setEvents(events => [...events, doc.data()])
          })
      })
    },[isFocused]);
    return (
        <View>
             <ImageBackground source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6JwPaFY0B1vbLzXu6HUGW6Ix4TReDfz_mXA&usqp=CAU"}} resizeMode="cover" style={{width: '100%', height: '100%'}}>
                <FlatList data={events} keyExtractor={(item) => item.id} renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('CardDetails', {address: item.address, attendees: item.attendees, creator: item.creator, datetime: item.datetime, loop: item.loop, name: item.name})}>
                        <View style={styles.container}>
                            <Text style={styles.containerItem}>{ item.name }</Text>
                        </View>
                    </TouchableOpacity>
                )} />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      fontSize: 24,
      padding: 20,
      borderRadius: 6,
      elevation: 3,
      backgroundColor: '#fff',
      shadowOffset: { width: 1, height: 1 },
      shadowColor: '#333',
      shadowOpacity: 0.3,
      shadowRadius: 2,
      marginHorizontal: 4,
      marginVertical: 6,
    },
    containerItem: {
      flex: 9,
    }
  });