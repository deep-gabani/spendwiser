import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { Ionicons } from '@expo/vector-icons';
import { SharedContext } from './../store';

import Button from './Button';


const Collapsible = ({ label, component, onVisible = null, viewStyle = {}, showByDefault = true, buttonStyle = {}, buttonTextStyle = {}, showIconAfter = true }) => {
    const [isVisible, setIsVisible] = useState(showByDefault);
  const { setBuffering } = useContext(SharedContext);

    let [fontsLoaded] = useFonts({
        Raleway_300Light,
        Raleway_500Medium,
        Raleway_700Bold,
        Raleway_900Black,
    });
    
    if(!fontsLoaded) {
        return null;
    }

    const handlePress = async () => {
        if (onVisible && !isVisible) {
            setBuffering(true);
            await onVisible();
        }
        setIsVisible(!isVisible);
        setBuffering(false);
    }

    return (
        <View style={{ ...viewStyle }}>
            <Button
                text={label}
                icon={<Ionicons name={`ios-chevron-${isVisible ? 'down' : 'up'}`} size={24} color="#0F172A" />}
                onPress={handlePress}
                buttonStyle={{ padding: 8, justifyContent: 'flex-start', ...buttonStyle }}
                buttonTextStyle={{ flex: 1, paddingHorizontal: 8, fontSize: 16, fontFamily: 'Raleway_900Black', ...buttonTextStyle }}
                showIconAfter={showIconAfter}
            />
            {isVisible && component}
        </View>
    );

}


const styles = StyleSheet.create({});


export default Collapsible;
