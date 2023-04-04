import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';


const TextView = ({ texts, inline = true }) => {

  let [fontsLoaded] = useFonts({
    Raleway_300Light,
    Raleway_500Medium,
    Raleway_700Bold,
    Raleway_900Black,
  });
  
  if(!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ ...styles.view, flexDirection: inline ? 'row' : 'column' }}>
      {texts.map(text => {
        const label = text[0];
        const style = text[1];
        return (
          <Text
            key={text}
            style={{ ...styles.text, ...style }}>{label}</Text>
        );
      })}
    </View>
  );

}


const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  text: {
    color: '#0F172A',
    fontFamily: 'Raleway_500Medium',
    paddingHorizontal: 2,
    textAlignVertical: 'bottom'
  },
});


export default TextView;
