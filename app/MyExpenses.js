import React, { useContext, useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, ActivityIndicator, Modal, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { getState, setState, SharedContext, userLoggedIn } from './store';
import * as apis from './apis.js';
import { parseDateTime, capitalizeString, beautifyMobileNo, getS3Image } from './utils';
import { SvgXml } from 'react-native-svg';

import Button from './components/Button';
import TextView from './components/TextView';
import { icons } from './constants';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Header = () => {
  return (
    <View style={styles.header}>
      <TextView texts={[['My Expenses', { fontFamily: 'Raleway_700Bold', }]]} />
    </View>
  );
}


const ExpenseItem = ({ item }) => {
  const { name, occurrence, quantity, tax, price } = item;

  return (
    <View style={expensesStyles.expenseItemView}>
      <TextView texts={[[name, {}], [`${quantity['value']} ${quantity['unit'].toLowerCase()}`, { fontFamily: 'Raleway_700Bold', fontSize: 12, opacity: 0.5 }]]} inline={false} viewStyle={{ paddingTop: 8, }} />
      <TextView texts={[['₹', { fontSize: 12, }], [price, { paddingRight: 8, fontFamily: 'Raleway_700Bold' }], ['x', { paddingRight: 8, fontSize: 12, }], [occurrence, {}]]}  />
    </View>
  )
}


const Expense = ({ expense }) => {
  const { expense_id, s3_image_uri, uploaded_time, is_extraction_finished } = expense;
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showImageEnlarged, setShowImageEnlarged] = useState(false);
  const [imageSrcData, setImageSrcData] = useState(false);
  const { setToast, setBuffering } = useContext(SharedContext);
  // setBuffering(false);

  const showExpenseInDetail = async () => {
    setBuffering(true);

    // Fetching the image from the S3 bucket...
    setImageSrcData(await getS3Image(s3_image_uri));

    setBuffering(false);
    setShowExpenseModal(true);
  }


  // Extraction is still in progress...
  if (!is_extraction_finished) {
    return (
      <View style={{ ...expensesStyles.expense, opacity: 0.5 }}>
        <TextView
          texts={[[parseDateTime(uploaded_time, 'D'), { fontFamily: 'Raleway_900Black' }], [parseDateTime(uploaded_time, 'MMMM', 3), {}], [parseDateTime(uploaded_time, 'HH:mm'), { opacity: 0.5, fontSize: 12, }]]}
          viewStyle={{ alignItems: 'center', padding: 8, }}
          inline={false}
        />
        <ActivityIndicator size="large" color="#0F172A" style={expensesStyles.icon} />
        <View style={expensesStyles.contentView}>
          <TextView texts={[['₹', { fontFamily: 'Raleway_700Bold' }], ['$$$', { fontFamily: 'Raleway_900Black', fontSize: 24 }], ['/-', { fontFamily: 'Raleway_700Bold' }]]} />
          <View style={{ ...expensesStyles.line, width: '60%', marginTop: 8, height: 6 }}></View>
          <View style={{ ...expensesStyles.line, width: '100%', }}></View>
          <View style={{ ...expensesStyles.line, width: '120%', }}></View>
          <View style={{ ...expensesStyles.line, width: '160%', height: 4, }}></View>
        </View>
      </View>
    )
  }
  
  // Expense...
  const { datetime, shop, expense_type, bill_amount, items, delivery } = expense;
  return (
    <TouchableOpacity style={expensesStyles.expense} onPress={showExpenseInDetail}>

      <TextView
        texts={[[parseDateTime(datetime, 'D'), { fontFamily: 'Raleway_900Black' }], [parseDateTime(datetime, 'MMMM', 3), {}], [parseDateTime(datetime, 'HH:mm'), { opacity: 0.5, fontSize: 12, }]]}
        viewStyle={{ alignItems: 'center', padding: 8, }}
        inline={false}
      />
      <SvgXml xml={icons[expense_type]} {...expensesStyles.icon} />
      <View style={expensesStyles.contentView}>
        <TextView texts={[['₹', { fontFamily: 'Raleway_700Bold' }], [bill_amount['paid'], { fontFamily: 'Raleway_900Black', fontSize: 24 }], ['/-', { fontFamily: 'Raleway_700Bold' }]]} />
        <TextView texts={[[capitalizeString(shop['name']), { fontFamily: 'Raleway_700Bold', marginTop: 8 }]]} />
        <TextView texts={[...items.map(i => [`  •  ${i['name']}`, {}])]} inline={false} />
      </View>
      
      <Modal presentationStyle="overFullScreen" animationType='fade' visible={showExpenseModal} transparent={true} onRequestClose={() => setShowExpenseModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowExpenseModal(false)}>
          <View style={expensesStyles.expenseInDetailViewBackground}>
            <ScrollView style={expensesStyles.expenseInDetailScrollView}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={expensesStyles.expenseInDetailView}>

                  <View style={expensesStyles.expenseInDetailHeader}>
                    <TextView texts={[[parseDateTime(datetime, 'HH:mm:SS'), { fontFamily: 'Raleway_900Black', opacity: 0.5 }], [parseDateTime(datetime, 'D MMMM, YYYY'), { fontFamily: 'Raleway_900Black' }]]} inline={false} />
                    <Button
                      icon={<MaterialCommunityIcons name="close" color={'#0F172A'} size={24} />}
                      buttonStyle={{ borderWidth: 0, padding: 4 }}
                      onPress={() => setShowExpenseModal(false)}
                    />
                  </View>

                  <View style={expensesStyles.expenseInDetailAmount}>
                    <View style={expensesStyles.expenseInDetailAmountView}>
                      <View>
                        <TextView texts={[['₹', { fontFamily: 'Raleway_700Bold' }], [bill_amount['paid'], { fontFamily: 'Raleway_900Black', fontSize: 24 }], ['/-', { fontFamily: 'Raleway_700Bold' }]]} />
                        <TextView texts={[[capitalizeString(shop['name']), { fontFamily: 'Raleway_900Black', marginTop: 4 }]]} />
                      </View>

                      <TouchableOpacity onPress={() => setShowImageEnlarged(true)}>
                        <Image
                          source={{ uri: imageSrcData }}
                          style={{ ...expensesStyles.icon, marginRight: 0 }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      <Modal visible={showImageEnlarged} transparent={true} animationType="fade" onRequestClose={() => setShowImageEnlarged(false)}>
                        <TouchableWithoutFeedback onPress={() => setShowImageEnlarged(false)}>
                          <View style={expensesStyles.imageEnlargedViewBackground}>
                            <TouchableWithoutFeedback onPress={() => {}}>
                              <View>
                                <Button
                                  icon={<MaterialCommunityIcons name="close" color={'#fff'} size={24} />}
                                  buttonStyle={{ borderWidth: 0, padding: 4, justifyContent: 'flex-end' }}
                                  onPress={() => setShowImageEnlarged(false)}
                                />
                                <Image style={expensesStyles.imageEnlarged} source={{ uri: imageSrcData }} resizeMode="contain" />
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>

                    </View>
                    <TextView texts={[[shop['address'], { opacity: 0.75, fontSize: 12 }]]} />
                    <TextView texts={[[beautifyMobileNo(shop['contact_no']), { fontFamily: 'Raleway_700Bold', opacity: 0.75, fontSize: 12 }]]} />
                  </View>

                  <View style={expensesStyles.expenseInDetailItems}>
                    {items.map(item => <ExpenseItem key={item['name']} item={item} />)}
                  </View>

                  <View style={expensesStyles.expenseInDetailPrice}>
                    <View style={expensesStyles.expenseInDetailPriceItem}>
                      <TextView texts={[['Total', { fontSize: 12, fontFamily: 'Raleway_700Bold' }]]} />
                      <TextView texts={[['₹', { fontFamily: 'Raleway_700Bold' }], [bill_amount['item_total'], { fontFamily: 'Raleway_900Black' }]]} />
                    </View>
                    <View style={expensesStyles.expenseInDetailPriceItem}>
                      <TextView texts={[['Delivery', { fontSize: 12, fontFamily: 'Raleway_700Bold' }]]} />
                      <TextView texts={[['+ ', { fontFamily: 'Raleway_700Bold' }], ['₹', { fontFamily: 'Raleway_700Bold' }], [bill_amount['delivery'], { fontFamily: 'Raleway_900Black' }]]} />
                    </View>
                    <View style={expensesStyles.expenseInDetailPriceItem}>
                      <TextView texts={[['Discount', { fontSize: 12, fontFamily: 'Raleway_700Bold' }]]} />
                      <TextView texts={[['- ', { fontFamily: 'Raleway_700Bold' }], ['₹', { fontFamily: 'Raleway_700Bold' }], [bill_amount['discount'], { fontFamily: 'Raleway_900Black' }]]} />
                    </View>
                    <View style={expensesStyles.expenseInDetailPriceItem}>
                      <TextView texts={[['Tax', { fontSize: 12, fontFamily: 'Raleway_700Bold' }]]} />
                      <TextView texts={[['+ ', { fontFamily: 'Raleway_700Bold' }], ['₹', { fontFamily: 'Raleway_700Bold' }], [bill_amount['tax'], { fontFamily: 'Raleway_900Black' }]]} />
                    </View>
                    <View style={expensesStyles.expenseInDetailItemsCalculationLine}></View>
                    <View style={{ ...expensesStyles.expenseInDetailPriceItem, paddingTop: 8, }}>
                      <TextView texts={[['Paid', { fontSize: 12, fontFamily: 'Raleway_900Black' }]]} />
                      <TextView texts={[['₹', { fontFamily: 'Raleway_700Bold' }], [bill_amount['paid'], { fontFamily: 'Raleway_900Black' }]]} />
                    </View>
                  </View>

                  <View style={expensesStyles.expenseInDetailDelivery}>
                    <TextView texts={[['Delivered to', { fontSize: 12, paddingRight: 4 }], [capitalizeString(delivery['address_tag']), { fontSize: 12, fontFamily: 'Raleway_900Black' }]]} />
                    <TextView texts={[[delivery['address'], { opacity: 0.75, fontSize: 12 }]]} />
                  </View>

                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </TouchableOpacity>
  );
}


const PersonalExpenses = ({ personalExpenses }) => {
  const { navigation } = useContext(SharedContext);

  if (!userLoggedIn()) {
    return (
      <View style={expensesStyles.innerContainer}>
        <Button
          text="Login to see your expenses!"
          buttonStyle={{ height: 128 }}
          buttonTextStyle={{ marginHorizontal: 16 }}
          icon={<AntDesign name='login' size={24} color="#0F172A" />}
          showIconAfter={true}
          onPress={() => navigation.navigate('My Profile')}
        />
      </View>
    );
  }

  return (
    <View style={expensesStyles.innerContainer}>
      {personalExpenses.map(expense => {
        return (
          <Expense key={expense['expense_id']} expense={expense} />
        );
      })}
    </View>
  );
}


const GroupExpenses = () => {
  const { navigation } = useContext(SharedContext);

  if (!userLoggedIn()) {
    return (
      <View style={expensesStyles.innerContainer}>
        <Button
          text="Login to see your expenses!"
          buttonStyle={{ height: 128 }}
          buttonTextStyle={{ marginHorizontal: 16 }}
          icon={<AntDesign name='login' size={24} color="#0F172A" />}
          showIconAfter={true}
          onPress={() => navigation.navigate('My Profile')}
        />
      </View>
    );
  }

  return (
    <View style={expensesStyles.innerContainer}>

    </View>
  );
}


const MyExpenses = () => {
  const [isPersonalExpensesVisible, setIsPersonalExpensesVisible] = useState(true);
  const [isGroupExpensesVisible, setIsGroupExpensesVisible] = useState(false);
  const [personalExpenses, setPersonalExpenses] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [currentPersonalExpensesPage, setCurrentPersonalExpensesPage] = useState(1);
  const { setToast, setBuffering } = useContext(SharedContext);
  
  const fetchPersonalExpenses = async () => {
    const { phone_number } = getState('user');
    const response = await apis.getPersonalExpenses({ phone_number: phone_number, page_no: currentPersonalExpensesPage });
    if ( response["statusCode"] === 200 ) {
      const { message, expenses } = response["body"];
      setToast({ text: message, severity: 'SUCCESS' });
      setPersonalExpenses(expenses);
    } else if ( response["statusCode"] === 500 ) {
      setToast({ text: response["body"]["message"], severity: 'FAILURE' });
    }
    setBuffering(false);
  }

  useEffect(() => {
    if (userLoggedIn() && personalExpenses.length === 0) {
      fetchPersonalExpenses();
      setBuffering(true);
    }
  }, [isPersonalExpensesVisible]);

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
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <View style={expensesStyles.container}>

          <Button
            text="Personal Expenses"
            icon={<Ionicons name={`ios-chevron-${isPersonalExpensesVisible ? 'down' : 'up'}`} size={24} color="#0F172A" />}
            onPress={() => setIsPersonalExpensesVisible(!isPersonalExpensesVisible)}
            buttonStyle={{ padding: 8, justifyContent: 'flex-start' }}
            buttonTextStyle={{ flex: 1, paddingHorizontal: 8, fontSize: 16, fontFamily: 'Raleway_900Black', }}
            showIconAfter={true}
          />
          {isPersonalExpensesVisible && <PersonalExpenses personalExpenses={personalExpenses} />}

          <Button
            text="Group Expenses"
            icon={<Ionicons name={`ios-chevron-${isGroupExpensesVisible ? 'down' : 'up'}`} size={24} color="#0F172A" />}
            onPress={() => setIsGroupExpensesVisible(!isGroupExpensesVisible)}
            buttonStyle={{ padding: 8, justifyContent: 'flex-start' }}
            buttonTextStyle={{ flex: 1, paddingHorizontal: 8, fontSize: 16, fontFamily: 'Raleway_900Black', }}
            showIconAfter={true}
          />
          {isGroupExpensesVisible && <GroupExpenses />}

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
});


const expensesStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingBottom: 48,
    paddingHorizontal: 16,
  },
  innerContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 16,
  },
  expense: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    marginVertical: 4,
    maxWidth: '100%',
    minHeight: 96,
  },
  icon: {
    paddingVertical: 8,
    marginLeft: 8,
    marginRight: 16,
    width: 40,
    height: 40,
  },
  contentView: {
    display: 'flex',
    flexDirection: 'column',
    borderLeftWidth: 0.5,
    borderStyle: 'dashed',
    paddingLeft: 16,
  },
  line: {
    height: 2,
    width: '50%',
    backgroundColor: '#0F172A',
    marginTop: 4,
  },
  expenseInDetailViewBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  expenseInDetailScrollView: {
    maxHeight: '75%',
    margin: 16,
  },
  expenseInDetailView: {
    padding: 16,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  expenseInDetailHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
  },
  expenseInDetailAmount: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
  },
  expenseInDetailAmountView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseInDetailDelivery: {
    marginTop: 16,
  },
  expenseInDetailItems: {
    marginTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
  },
  expenseItemView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseInDetailItemsCalculationLine: {
    marginTop: 8,
    borderTopWidth: 0.5,
    borderStyle: 'dashed',
    display: 'flex',
  },
  expenseInDetailPrice: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
  },
  expenseInDetailPriceItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  expenseInDetailImage: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageEnlargedViewBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEnlarged: {
    width: windowWidth - 64,
    height: windowHeight - 128,
  },
});


export default MyExpenses;
