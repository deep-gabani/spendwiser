import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as apis from './apis.js';
import { S3 } from 'aws-sdk';
import { awsAccessKey, awsSecretKey, awsS3BucketForExpenseImages } from './config';
import { getState, SharedContext } from './store';

import Button from './components/Button';
import Buffering from './components/Buffering';


const windowWidth = Dimensions.get('window').width;
const categories = ['Choose a Photo', 'Scan', 'Add Manually'];
const s3 = new S3({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
});


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
        <Button
          key={cat}
          text={cat}
          onPress={() => setCategory(cat)}
          buttonStyle={{ flex: 1, padding: 8, borderWidth: 0 }}
          buttonTextStyle={{ fontFamily: cat === category ? 'Raleway_900Black' : 'Raleway_700Bold' }}
        />
      ))}
    </View>
  );
}


const ChooseAPhoto = ({ image, setImage, clearImage }) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
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


const uploadImageToS3 = async (image) => {
  const { uri } = image;
  const fileName = uri.split('/').pop();
  const extension = fileName.split('.').pop();

  const imageData = await fetch(uri);
  const blobData = await imageData.blob();

  const { user } = getState();
  const { phone_number } = user;

  const params = {
    Bucket: awsS3BucketForExpenseImages,
    Key: `${phone_number}/${fileName}`,
    Body: blobData,
    ContentType: `image/${extension}`,
  };

  await s3.putObject(params).promise();
  const s3_image_uri = `s3://${awsS3BucketForExpenseImages}/${phone_number}/${fileName}`
  return s3_image_uri;
}


const AddExpense = () => {
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);
  const [scannedImage, setScannedImage] = useState(null);
  const { setToast, setBuffering } = useContext(SharedContext);

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
    const _image = category === categories[0] ? image : scannedImage;
    if (!_image) {
      setToast({ text: "No image provided", severity: 'WARNING' });
      return;
    }

    try {
      setBuffering(true);
      const s3_image_uri = await uploadImageToS3(_image);
      const response = await apis.submitExpenseImage({ s3_image_uri });
      if ( response["statusCode"] === 200) {
        const { message, expense_id } = response["body"];
        setToast({ text: message, severity: 'SUCCESS' });
        clearImage();
      }
    } catch (e) {
      setToast({ text: 'Failed to start extraction from the image. Try again!', severity: 'FAILURE' });
    } finally {
      setBuffering(false)
    }
  }

  const clearImage = () => {
    setImage(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <View>
          <CategorySelector category={category} setCategory={setCategory} />
          {category == categories[0] && <ChooseAPhoto image={image} setImage={setImage} clearImage={clearImage} />}
          {category == categories[1] && <Scan scannedImage={scannedImage} setScannedImage={setScannedImage} clearImage={clearImage} />}
          <Button
            text="Submit"
            onPress={submitExpense}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  closeImageButton: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
});


export default AddExpense;
