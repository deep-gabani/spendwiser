import React, { useState, useRef, useEffect, createContext } from 'react';
import { Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { Ionicons } from '@expo/vector-icons';


const severityToColorMapping = {
  'SUCCESS': '#7bed9f',
  'LOG': '#ffcc99',
  'WARNING': '#ffffcc',
  'FAILURE': '#ff9999'
}
const severityToIconMapping = {
  'SUCCESS': <Ionicons name="ios-checkmark-circle-outline" color={'#0F172A'} size={32} />,
  'LOG': <Ionicons name="ios-information-circle-outline" color={'#0F172A'} size={32} />,
  'WARNING': <Ionicons name="ios-warning-outline" color={'#0F172A'} size={32} />,
  'FAILURE': <Ionicons name="close-circle-outline" color={'#0F172A'} size={32} />,
}


const ToastContext = createContext();


const Toast = ({ toast, setToast }) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  let timer;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 250,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      // Waiting for 500ms for animation to complete...
      setTimeout(() => {
        setToast(null);
        clearTimeout(timer);
      }, 500);
    }, 10_000);
  }, []);

  const handleSwipeHorizontal = () => {
    clearTimeout(timer);
    setToast(null);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y }
      ], {
        useNativeDriver: false
      }),
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 100) {
          handleSwipeHorizontal();
        }
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  let [fontsLoaded] = useFonts({
    Raleway_300Light,
    Raleway_500Medium,
    Raleway_700Bold,
    Raleway_900Black,
  });
  
  if(!fontsLoaded) {
    return null;
  }

  if (!('text' in toast) || !('severity' in toast)) {
    clearTimeout(timer);
    return null;
  }
  
  const { text, severity } = toast;

  return (
    <Animated.View style={{ ...styles.toastView, backgroundColor: severityToColorMapping[severity], transform: [{ translateX: pan.x }, { translateY: pan.y }, { translateY: slideAnim }], zIndex: 1 }} {...panResponder.panHandlers}>
      {severityToIconMapping[severity]}
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );

}


const styles = StyleSheet.create({
  toastView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    alignItems: 'center',
    padding: 8,
    position: 'absolute',
    bottom: 64,
    marginHorizontal: 16,
    paddingLeft: 16,
  },
  text: {
    flex: 1,
    color: '#0F172A',
    fontFamily: 'Raleway_700Bold',
    lineHeight: 20,
    marginLeft: 8
  },
});


export {
  Toast,
  ToastContext
};
