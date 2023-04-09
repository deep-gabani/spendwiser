import React, { useContext, useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, TextInput } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as apis from './apis.js';
import { SharedContext } from './store';
import { uploadImageToS3, convertDateAndTimeToDateTimeString, parseDateTime, getCurrentDateTime, validatePhoneNumber } from './utils';

import Button from './components/Button';
import TextBox from './components/TextBox';
import TextView from './components/TextView';
import Collapsible from './components/Collapsible';


const windowWidth = Dimensions.get('window').width;
const categories = ['Choose a Photo', 'Scan', 'Add Manually'];


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


const ExpenseItem = ({ items, setItems, itemIndex }) => {
  const item = items[itemIndex];

  const [name, setName] = useState(item['name']);
  const [occurrence, setOccurrence] = useState(item['occurrence']);
  const [price, setPrice] = useState(item['price']);
  const [quantityValue, setQuantityValue] = useState(item['quantity']['value']);
  const [quantityUnit, setQuantityUnit] = useState(item['quantity']['unit']);
  const [taxValue, setTaxValue] = useState(item['tax']['value']);
  
  useEffect(() => {
    // Creating a new object of updated item since we are not getting what is updated...
    const updatedItem = {
      "name": name,
      "occurrence": occurrence,
      "quantity": {
        "value": quantityValue,
        "unit": quantityUnit
      },
      "tax": {
        "value": taxValue,
        "unit": item['tax']['unit']
      },
      "price": price
    };

    const newItems = [...items];
    newItems[itemIndex] = updatedItem;
    setItems(newItems);
  }, [ name, occurrence, price, quantityValue, quantityUnit, taxValue ]);

  deleteItem = () => {
    const newItems = items.filter((item, index) => index !== itemIndex);
    setItems(newItems);
  }

  return (
    <View style={addManualStyles.item}>

      <View style={addManualStyles.itemRow}>
        <View style={addManualStyles.itemNameView}>
          <Text style={addManualStyles.label}>Name</Text>
          <TextInput
            style={addManualStyles.input}
            placeholder="Cabbage"
            onChangeText={setName}
            value={name}
          />
        </View>
        <View style={addManualStyles.itemPriceView}>
          <Text style={addManualStyles.label}>Price</Text>
          <TextInput
            style={addManualStyles.input}
            placeholder="12"
            onChangeText={setPrice}
            value={price}
            keyboardType='numeric'
          />
        </View>
        <View style={addManualStyles.itemOccurrenceView}>
          <Text style={addManualStyles.label}>Quantity</Text>
          <TextInput
            style={addManualStyles.input}
            placeholder="1"
            onChangeText={setOccurrence}
            value={occurrence}
            keyboardType='numeric'
          />
        </View>
      </View>

      <View style={addManualStyles.itemRow}>
        <View style={addManualStyles.itemNameUnitValueView}>
          <Text style={addManualStyles.label}>Unit</Text>
          <TextInput
            style={addManualStyles.input}
            placeholder="1"
            onChangeText={setQuantityValue}
            value={quantityValue}
            keyboardType='numeric'
          />
        </View>
        <View style={addManualStyles.itemNameUnitView}>
          <Text style={addManualStyles.label}>{" "}</Text>
          <TextInput
            style={{ ...addManualStyles.input, borderLeftWidth: 0, }}
            placeholder="Piece"
            onChangeText={setQuantityUnit}
            value={quantityUnit}
          />
        </View>
        <View style={addManualStyles.itemTaxView}>
          <Text style={addManualStyles.label}>Tax (%)</Text>
          <TextInput
            style={addManualStyles.input}
            placeholder="12"
            onChangeText={setTaxValue}
            value={taxValue}
            keyboardType='numeric'
          />
        </View>
        <View style={addManualStyles.deleteItemButtonView}>
          <Button
            icon={<Ionicons name="ios-trash-bin" size={24} color="#0F172A" />}
            buttonStyle={{ height: 68, }}
            onPress={deleteItem}
          />
        </View>
      </View>

    </View>
  );
}


const AddManually =  ({ manualExpense, setManualExpense }) => {
  const [amountPaid, setAmountPaid] = useState(manualExpense['bill_amount']['paid']);
  const [amountDelivery, setAmountDelivery] = useState(manualExpense['bill_amount']['delivery']);
  const [amountDiscount, setAmountDiscount] = useState(manualExpense['bill_amount']['discount']);
  const [amountTax, setAmountTax] = useState(manualExpense['bill_amount']['tax']);
  const [shopName, setShopName] = useState(manualExpense['shop']['name']);
  const [shopAddress, setShopAddress] = useState(manualExpense['shop']['address']);
  const [shopContactNo, setShopContactNo] = useState(manualExpense['shop']['contact_no']);
  const [deliveryAddress, setDeliveryAddress] = useState(manualExpense['delivery']['address']);
  const [deliveryAddressTag, setDeliveryAddressTag] = useState(manualExpense['shop']['address_tag']);
  const [items, setItems] = useState(manualExpense['items']);
  const [date, setDate] = useState(parseDateTime(manualExpense['datetime'], "DD/MM/YYYY"));
  const [time, setTime] = useState(parseDateTime(manualExpense['datetime'], "HH:mm:ss"));

  useEffect(() => {
    // Creating a new object of updated expense...
    const updatedExpense = {
      shop: {
        name: shopName,
        address: shopAddress,
        contact_no: shopContactNo,
      },
      bill_amount: {
        tax: amountTax,
        delivery: amountDelivery,
        discount: amountDiscount,
        paid: amountPaid,
      },
      items: items,
      delivery: {
        address: deliveryAddress,
        addressTag: deliveryAddressTag,
      },
      datetime: convertDateAndTimeToDateTimeString(date, time),
    };

    setManualExpense(updatedExpense);
  }, [ amountPaid, amountDelivery, amountDiscount, amountTax, shopName, shopAddress, shopContactNo, deliveryAddress, deliveryAddressTag, items, date, time ]);

  const addNewItem = () => {
    // Adding item boilerplate for the new expense item...
    const newItem = {
      "name": "",
      "occurrence": "",
      "quantity": {
        "value": "",
        "unit": "Piece"
      },
      "tax": {
        "value": "",
        "unit": "PERCENT"
      },
      "price": ""
    };
    const newItems = [...items];
    newItems.push(newItem);
    setItems(newItems);
  }

  return (
    <View>

      <Collapsible
        label="Expense"
        showByDefault={false}
        component={
          <View style={addManualStyles.expenseAmount}>
            <TextBox
              label="Amount"
              placeholder={"284"}
              onChange={setAmountPaid}
              value={amountPaid}
              textInputProps={{ keyboardType: "numeric" }}
            />
            <TextBox
              label="Delivery"
              placeholder={"0"}
              onChange={setAmountDelivery}
              value={amountDelivery}
              textInputProps={{ keyboardType: "numeric" }}
            />
            <TextBox
              label="Discount"
              placeholder={"120"}
              onChange={setAmountDiscount}
              value={amountDiscount}
              textInputProps={{ keyboardType: "numeric" }}
            />
            <TextBox
              label="Tax"
              placeholder={"44.4"}
              onChange={setAmountTax}
              value={amountTax}
              textInputProps={{ keyboardType: "numeric" }}
            />
          </View>
        }
      />

      <Collapsible
        label="Items"
        showByDefault={false}
        component={
          <View style={addManualStyles.items}>

            {items.map((item, itemIndex) => <ExpenseItem key={itemIndex} items={items} setItems={setItems} itemIndex={itemIndex} /> )}
            
            <Button
              text="Add Item"
              icon={<Ionicons name="add" size={24} color="#0F172A" />}
              onPress={addNewItem}
            />
            
          </View>
        }
      />

      <Collapsible
        label="Shop"
        showByDefault={false}
        component={
          <View style={addManualStyles.shop}>
            <TextBox
              label="Shop Name"
              placeholder="Big Basket"
              onChange={setShopName}
              value={shopName}
            />
            <TextBox
              label="Shop Address"
              placeholder={"XPress Mart,\nIRIS Shop No - 2 & 3 - 134/3,\nBaner, Pune - 411015."}
              onChange={setShopAddress}
              value={shopAddress}
              textInputStyle={{ textAlignVertical: 'top' }}
              textInputProps={{ multiline: true, numberOfLines: 3 }}
            />
            <TextBox
              label="Shop Contact No."
              placeholder="95210 39236"
              onChange={setShopContactNo}
              value={shopContactNo}
              textInputProps={{ keyboardType: "phone-pad", maxLength: 10 }}
              prependTextInputLabel="+91"
            />
          </View>
        }
      />

      <Collapsible
        label="Delivery"
        showByDefault={false}
        component={
          <View style={addManualStyles.delivery}>
            <TextBox
              label="Delivery Address"
              placeholder={"D-802,\nRelicon alpine ridge,\nBaner, Pune - 411015."}
              onChange={setDeliveryAddress}
              value={deliveryAddress}
              textInputStyle={{ textAlignVertical: 'top' }}
              textInputProps={{ multiline: true, numberOfLines: 3 }}
            />
            <TextBox
              label="Delivery Address Tag"
              placeholder="Home"
              onChange={setDeliveryAddressTag}
              value={deliveryAddressTag}
            />
          </View>
        }
      />

      <Collapsible
        label="Expense Time"
        showByDefault={false}
        component={
          <View style={addManualStyles.datetime}>
            
            <View style={addManualStyles.dateView}>
              <Text style={addManualStyles.label}>Date</Text>
              <TextInput
                style={addManualStyles.input}
                placeholder="08/04/2023"
                onChangeText={setDate}
                value={date}
              />
            </View>

            <View style={addManualStyles.timeView}>
              <Text style={addManualStyles.label}>Time</Text>
              <TextInput
                style={addManualStyles.input}
                placeholder="05:48:42"
                onChangeText={setTime}
                value={time}
              />
            </View>

          </View>
        }
      />

    </View>
  );
}


const AddExpense = () => {
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);
  const [scannedImage, setScannedImage] = useState(null);
  const [manualExpense, setManualExpense] = useState({
    shop: {
      name: "",
      address: "",
      contact_no: "",
    },
    bill_amount: {
      tax: "",
      delivery: "",
      discount: "",
      paid: "",
    },
    items: [],
    delivery: {
      address: "",
      addressTag: "Home",
    },
    datetime: getCurrentDateTime(),
  });
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

  const isManualExpenseValid = () => {
    const { shop, bill_amount, items, datetime } = manualExpense;

    // For expense amount...
    for (const item in bill_amount) {
      if (bill_amount[item] !== "" && isNaN(bill_amount[item])) {
        setToast({ text: `Please enter a valid ${item} amount!`, severity: 'WARNING' });
        return false;
      }
    }

    // For items...
    items.forEach(item => {
      const { name, occurrence, quantity, tax, price } = item;
      if (occurrence !== "" && isNaN(occurrence)) {
        setToast({ text: `Please enter a valid occurrence number for ${name}!`, severity: 'WARNING' });
        return false;
      }
      if (quantity['value'] !== "" && isNaN(quantity['value'])) {
        setToast({ text: `Please enter a valid quantity for ${name}!`, severity: 'WARNING' });
        return false;
      }
      if (tax['value'] !== "" && (isNaN(tax['value']) || parseFloat(tax['value']) < 0 || parseFloat(tax['value']) > 100)) {
        setToast({ text: `Please enter a valid tax percentage for ${name}!`, severity: 'WARNING' });
        return false;
      }
      if (price !== "" && isNaN(price)) {
        setToast({ text: `Please enter a valid price for ${name}!`, severity: 'WARNING' });
        return false;
      }
    });

    // For shop...
    if (shop['contact_no'] !== "" && !validatePhoneNumber(shop["contact_no"])) {
      setToast({ text: 'Please enter a valid shop contact number!', severity: 'WARNING' });
      return false;
    }

    // For datetime...
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    if (!regex.test(datetime)) {
      setToast({ text: 'Please enter a valid expense time!', severity: 'WARNING' });
      return false;
    }

    return true;
  }


  const submitExpense = async () => {
    // When user is adding the expense manually...
    if (category === categories[2]) {
      setBuffering(true);
      if (isManualExpenseValid()) {
        const response = await apis.submitManualExpense({ expense: manualExpense });
        if ( response["statusCode"] === 200) {
          const { message, expense_id } = response["body"];
          setToast({ text: message, severity: 'SUCCESS' });
        }
      }
      setBuffering(false);
    } else {
      // When user is choosing a photo or scanning one...
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
  }

  const clearImage = () => {
    setImage(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.innerContainer}>
          <CategorySelector category={category} setCategory={setCategory} />
          {category == categories[0] && <ChooseAPhoto image={image} setImage={setImage} clearImage={clearImage} />}
          {category == categories[1] && <Scan scannedImage={scannedImage} setScannedImage={setScannedImage} clearImage={clearImage} />}
          {category === categories[2] && <AddManually manualExpense={manualExpense} setManualExpense={setManualExpense} />}
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
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  headerText: {
    fontFamily: 'Raleway_700Bold',
  },
  innerContainer: {
    flex: 1,
    paddingBottom: 48,
    paddingHorizontal: 16,
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


const addManualStyles = StyleSheet.create({
  expenseAmount: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 32,
  },
  shop: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 32,
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 32,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 0.5,
    borderStyle: 'dashed',
    padding: 8,
    marginTop: 4,
  },
  itemRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  delivery: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 32,
  },
  datetime: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 32,
  },

  label: {
    fontFamily: 'Raleway_300Light'
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
  },

  itemNameView: {
    width: '57%'
  },
  itemPriceView: {
    width: '25%',
    marginLeft: '1%'
  },
  itemOccurrenceView: {
    width: '16%',
    marginLeft: '1%'
  },
  itemNameUnitValueView: {
    width: '25%',
  },
  itemNameUnitView: {
    width: '34%',
  },
  itemTaxView: {
    width: '16%',
    marginLeft: '1%'
  },
  deleteItemButtonView: {
    width: '15%',
    marginLeft: '9%'
  },
  dateView: {
    width: '60%'
  },
  timeView: {
    width: '39%',
    marginLeft: '1%',
  }

});


export default AddExpense;
