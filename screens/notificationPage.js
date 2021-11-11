import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView
} from 'react-native';

export default class Notifications extends Component {
  
  // TO ROBBIE OR CADEN I could only make this code work by putting it into a class/ Component
  // U may have to fix it to include navigation


  constructor(props) {
    super(props);
    this.state = {
      data:[
        {id:1, image: "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png", 
        name:"User", text:" \nThe owner of the Volunteer event you follow has posted an announcement"}, 
        
        {id:2, image: "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png", 
        name:"User", text:" \nThe Sports loop event will start tomorrow at 15:00"}, 

      ]
    }
  }

  render() {
    return (
      <ScrollView>
      <FlatList
        style={styles.root}
        data={this.state.data}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator}/>
          )
        }}
        keyExtractor={(item)=>{
          return item.id.toString();
        }}
        renderItem={(item) => {
          const Notification = item.item;
          let attachment = <View/>;

          let mainContentStyle;
          if(Notification.attachment) {
            mainContentStyle = styles.mainContent;
            attachment = <Image style={styles.attachment} source={{uri:Notification.attachment}}/>
          }
          return(
            <View style={styles.container}>
              <Image source={{uri:Notification.image}} style={styles.avatar}/>
              <View style={styles.content}>
                <View style={mainContentStyle}>
                  <View style={styles.text}>
                    <Text style={styles.name}>{Notification.name}</Text>
                    <Text>{Notification.text}</Text>
                  </View>
                  <Text style={styles.timeAgo}>
                    2 hours ago
                  </Text>
                  {/* The time can be imported from the database */}
                </View>
                {attachment}
              </View>
            </View>
          );
        }}/>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#FFFFFF"
  },
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: 'flex-start'
  },
  avatar: {
    width:50,
    height:50,
    borderRadius:25,
  },
  text: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap:'wrap'

  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0
  },
  mainContent: {
    marginRight: 60
  },
  img: {
    height: 50,
    width: 50,
    margin: 0
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  timeAgo:{
    fontSize:12,
    color:"#696969"
  },
  name:{
    fontSize:16,
    color:"#b37400"
  }
}); 