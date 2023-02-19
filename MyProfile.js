import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';

function MyExpenses() {
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
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>
      <Text style={styles.text}>Your profile options will be displayed here!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontFamily: 'Raleway_700Bold'
  },
  text: {
    fontFamily: 'Raleway_300Light'
  },
});

export default MyExpenses;
