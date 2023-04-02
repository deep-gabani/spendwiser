import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Modal } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';


const Buffering = () => {

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
    <Modal presentationStyle="overFullScreen" animationType='fade' visible={true} transparent={true}>
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  text: {
    padding: 8,
    color: '#0F172A',
    fontSize: 24,
    fontFamily: 'Raleway_700Bold',
  }
});


export default Buffering;
