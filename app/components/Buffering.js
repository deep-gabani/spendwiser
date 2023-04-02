import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Modal } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';


const Buffering = ({ visible }) => {

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
    <Modal presentationStyle="fullScreen" visible={visible}>
        <View style={styles.bufferingView}>
            <ActivityIndicator size="large" color="#0F172A" />
            <Text style={styles.text}>Loading...</Text>
        </View>
    </Modal>
  );

}


const styles = StyleSheet.create({
    bufferingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -96,
    },
    text: {
        padding: 8,
        color: '#0F172A',
        fontFamily: 'Raleway_700Bold',
    }
});


export default Buffering;
