import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const windowWidth = Dimensions.get('window').width;
const categories = ['Choose a Photo', 'Scan', 'Add Manually'];
const BASE_URL = 'https://better-rats-attack-49-248-197-218.loca.lt';
const PROCESS_GALLERY_IMAGE = 'process_gallery_image';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Add Expense</Text>
    </View>
  );
}


const CategorySelector = ({ category, setCategory }) => {
  return (
    <View style={styles.categorySelector}>
      {categories.map(cat => (
        <TouchableOpacity
          style={styles.categorySelectorButton}
          key={cat}
          onPress={() => setCategory(cat)}
        >
          <Text style={{ ...styles.categorySelectorButtonText, fontFamily: category === cat ? 'Raleway_700Bold' : 'Raleway_300Light' }}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}


const ChooseAPhoto = ({ image, setImage }) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const clearImage = () => {
    setImage(null);
  }

  return (
    <View>
      {image ?
        <View>
          <Image source={{ uri: image.uri }} style={styles.chosenImage} resizeMode="contain" />
          <TouchableOpacity style={styles.closeImageButton} onPress={clearImage}>
            <MaterialCommunityIcons name="close" color={'#0F172A'} size={32} />
          </TouchableOpacity>
        </View>
      :
        <TouchableOpacity style={styles.chooseAPhotoButton} onPress={pickImage}>
          <MaterialCommunityIcons name="image" color={'#0F172A'} size={56} />
        </TouchableOpacity>
      }
    </View>
  );
}


const Scan = ({ scannedImage, setScannedImage }) => {
  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setScannedImage(result.assets[0]);
    }
  };

  const clearImage = () => {
    setScannedImage(null);
  }

  return (
    <View>
      {scannedImage ?
        <View>
          <Image source={{ uri: scannedImage.uri }} style={styles.chosenImage} resizeMode="contain" />
          <TouchableOpacity style={styles.closeImageButton} onPress={clearImage}>
            <MaterialCommunityIcons name="close" color={'#0F172A'} size={32} />
          </TouchableOpacity>
        </View>
      :
        <TouchableOpacity style={styles.chooseAPhotoButton} onPress={takeImage}>
          <MaterialCommunityIcons name="line-scan" color={'#0F172A'} size={56} />
        </TouchableOpacity>
      }
    </View>
  );
}


const SubmitExpense = ({ submitExpense }) => {
  return (
    <TouchableOpacity style={styles.submitExpenseButton} onPress={submitExpense}>
      <Text style={styles.submitExpenseButtonText}>Submit</Text>
    </TouchableOpacity>
  );
}


const ExtractedData = ({ extractedData }) => {
  return (
    <View style={styles.extractedData}>
      <Text>{JSON.stringify(extractedData)}</Text>
    </View>
  );
}


const MyExpenses = () => {
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);
  const [scannedImage, setScannedImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  let [fontsLoaded] = useFonts({
    Raleway_300Light,
    Raleway_500Medium,
    Raleway_700Bold,
    Raleway_900Black,
  });
  
  if(!fontsLoaded) {
    return null;
  }

  const submitExpense = async () => {
    const imageUriParts = image.uri.split('/');
    const image_name = imageUriParts[imageUriParts.length - 1];
    const base64Image = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' });

    try {
      const apiUrl = `${BASE_URL}/${PROCESS_GALLERY_IMAGE}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64_image: base64Image,
          image_name: image_name,
        }),
      });
      const data = await response.json();
      setExtractedData(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <CategorySelector category={category} setCategory={setCategory} />
        {category == categories[0] && <ChooseAPhoto image={image} setImage={setImage} />}
        {category == categories[1] && <Scan scannedImage={scannedImage} setScannedImage={setScannedImage} />}
        <SubmitExpense submitExpense={submitExpense} />
        {extractedData !== null && <ExtractedData extractedData={extractedData} />}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: 48
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1
  },
  headerText: {
    fontFamily: 'Raleway_700Bold',
  },
  categorySelector: {
    display: 'flex',
    flexDirection: 'row',
  },
  categorySelectorButton: {
    padding: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySelectorButtonText: {
    color: '#0F172A',
    fontFamily: 'Raleway_300Light',
  },
  chooseAPhotoButton: {
    width: windowWidth - 32,
    height: windowWidth - 32,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chosenImage: {
    width: windowWidth - 32,
    aspectRatio: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#0F172A',
    justifyContent: "center",
    alignItems: "center",
  },
  updateImageOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 4
  },
  closeImageButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#CBD5E1'
  },
  submitExpenseButton: {
    padding: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4
  },
  submitExpenseButtonText: {
    color: '#0F172A',
    fontFamily: 'Raleway_700Bold',
  }
});


export default MyExpenses;
