import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';


const Button = ({ icon = null, text = null, onPress, buttonStyle = {}, buttonTextStyle = {}, showIconAfter = false }) => {

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
    <TouchableOpacity style={{ ...styles.button, ...buttonStyle }} onPress={onPress}>
      {!showIconAfter && icon && icon}
      {text && <Text style={{ ...styles.buttonText, ...buttonTextStyle }}>{text}</Text>}
      {showIconAfter && icon && icon}
    </TouchableOpacity>
  );

}


const styles = StyleSheet.create({
    button: {
      padding: 16,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 4,
      flexDirection: 'row',
    },
    buttonText: {
      color: '#0F172A',
      fontFamily: 'Raleway_700Bold',
    },
});


export default Button;
