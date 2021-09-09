import { Text, ImageBackground, View } from 'react-native';
import React from 'react';

export default function Home({ navigation }) {
    return (
        <View>
             <ImageBackground source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6JwPaFY0B1vbLzXu6HUGW6Ix4TReDfz_mXA&usqp=CAU"}} resizeMode="cover" style={{width: '100%', height: '100%'}}>
            <Text>
                Home
            </Text>
            </ImageBackground>
        </View>
    );
}