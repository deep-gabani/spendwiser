import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const windowWidth = Dimensions.get('window').width;
const categories = ['Choose a Photo', 'Scan', 'Add Manually'];
const BASE_URL = 'https://sweet-bananas-chew-117-97-188-187.loca.lt';
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


const ChooseAPhoto = ({ image, setImage, clearImage }) => {
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

  return (
    <View>
      {image ?
        <View>
          <Image source={{ uri: image.uri }} style={styles.chosenImage} resizeMode="contain" />
          <TouchableOpacity style={styles.closeImageButton} onPress={() => clearImage(setImage)}>
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


const Scan = ({ scannedImage, setScannedImage, clearImage }) => {
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

  return (
    <View>
      {scannedImage ?
        <View>
          <Image source={{ uri: scannedImage.uri }} style={styles.chosenImage} resizeMode="contain" />
          <TouchableOpacity style={styles.closeImageButton} onPress={() => clearImage(setScannedImage)}>
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
  const { text } = extractedData;

  return (
    <View style={styles.extractedData}>
      <Text>{text}</Text>
    </View>
  );
}


const GetImageNameBase64 = async (image) => {
  const imageUriParts = image.uri.split('/');
  const imageName = imageUriParts[imageUriParts.length - 1];
  const base64Image = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' });
  return {
    imageName: imageName,
    base64Image: base64Image
  }
}


const ExtractedDataBuffering = () => {
  return (
    <ActivityIndicator size="large" color="#0F172A" style={styles.extractedDataBuffering} />
  )
}


const MyExpenses = () => {
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);
  const [scannedImage, setScannedImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [extractedDataBuffering, setExtractedDataBuffering] = useState(false);

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
    setExtractedData(null);
    setExtractedDataBuffering(true);
    const _image = category === categories[0] ? image : scannedImage;
    if (!_image) {
      setExtractedDataBuffering(false);
      return;
    }

    const { imageName, base64Image } = await GetImageNameBase64(_image);

    try {
      const apiUrl = `${BASE_URL}/${PROCESS_GALLERY_IMAGE}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'base64_image': base64Image,
          'image_name': imageName,
        }),
      });
      const data = await response.json();
      setExtractedDataBuffering(false);
      setExtractedData(data);
    } catch (error) {
      console.error(error);
    }
  }

  const clearImage = ( setImageNull ) => {
    setImageNull(null);
    setExtractedData(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <CategorySelector category={category} setCategory={setCategory} />
        {category == categories[0] && <ChooseAPhoto image={image} setImage={setImage} clearImage={clearImage} />}
        {category == categories[1] && <Scan scannedImage={scannedImage} setScannedImage={setScannedImage} clearImage={clearImage} />}
        {!extractedDataBuffering ?
          <SubmitExpense
            submitExpense={submitExpense}
            extractedData={extractedData}
            setExtractedData={setExtractedData}
          />
        :
          <ExtractedDataBuffering />
        }
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
  },
  extractedDataBuffering: {
    height: 56,
  }
});


export default MyExpenses;
