import React from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions} from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';


const TextBox = ({ label = null, placeholder, onChange, value, textInputProps = {}, textInputStyle = {}, prependTextInputLabel = null }) => {

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
    <View style={styles.textBoxView}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputView}>
        {prependTextInputLabel && <Text style={styles.prependedTextInputLabel}>{prependTextInputLabel}</Text>}
        <TextInput
          style={{
            ...styles.input,
            ...textInputStyle,
            borderLeftWidth: prependTextInputLabel ? 0 : 1
          }}
          placeholder={placeholder}
          onChangeText={onChange}
          value={value}
          {...textInputProps}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  textBoxView: {
    flex: 1,
  },
  label: {
    fontFamily: 'Raleway_300Light'
  },
  inputView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  prependedTextInputLabel: {
    fontFamily: 'Raleway_300Light',
    fontSize: 24,
    paddingVertical: 16,
    paddingLeft: 16,
    borderWidth: 1,
    marginVertical: 4,
    borderRightWidth: 0
  },
  input: {
    flex: 1,
    fontSize: 24,
    padding: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    fontFamily: 'Raleway_700Bold',
  }
});


export default TextBox;