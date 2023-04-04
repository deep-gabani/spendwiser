import React, { useContext, useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { Ionicons } from '@expo/vector-icons';
import { getState, SharedContext } from './store';
import * as apis from './apis.js';
import { parseDateTime, capitalizeString } from './utils';
import { SvgXml } from 'react-native-svg';

import Button from './components/Button';
import TextView from './components/TextView';
import { icons } from './constants';


const Header = () => {
  return (
    <View style={styles.header}>
      <TextView texts={[['My Expenses', { fontFamily: 'Raleway_700Bold', }]]} />
    </View>
  );
}


const Expense = ({ expense }) => {
  const { expense_id, s3_image_uri, uploaded_time, is_extraction_finished } = expense;

  // Extraction is still in progress...
  if (!is_extraction_finished) {
    return (
      <View style={expensesStyles.expense}>
        <ActivityIndicator size="large" color="#0F172A" style={expensesStyles.icon} />
        <View style={expensesStyles.contentView}>
          <View style={{ ...expensesStyles.line, width: '50%' }}></View>
          <View style={{ ...expensesStyles.line, width: '60%' }}></View>
          <View style={{ ...expensesStyles.line, width: '75%', height: 4 }}></View>
          <TextView texts={[['id:', { fontFamily: 'Raleway_700Bold' }], [expense_id, { fontSize: 12, }]]} />
          <TextView texts={[[parseDateTime(uploaded_time), { fontFamily: 'Raleway_700Bold' }]]} />
        </View>
      </View>
    )
  }
  
  // Expense...
  const { datetime, shop, expense_type, bill_amount, items, delivery, expense_extraction_time } = expense;
  const { paid } = bill_amount;
  return (
    <View style={expensesStyles.expense}>
      <SvgXml xml={icons[expense_type]} {...expensesStyles.icon} />
      <View style={expensesStyles.contentView}>
        <TextView texts={[['₹', { fontFamily: 'Raleway_700Bold' }], [paid, { fontFamily: 'Raleway_900Black', fontSize: 24 }], ['/-', { fontFamily: 'Raleway_700Bold' }]]} />
        <TextView texts={[[capitalizeString(shop['name']), { fontFamily: 'Raleway_700Bold', marginTop: 8 }]]} />
        <TextView texts={[...items.map(i => [`  •  ${i['name']}`, {}])]} inline={false} />
        <TextView texts={[[parseDateTime(uploaded_time), { fontFamily: 'Raleway_700Bold', marginTop: 8 }]]} />
      </View>
    </View>
  );
}


const PersonalExpenses = ({ personalExpenses }) => {
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
  return (
    <View style={expensesStyles.innerContainer}>

    </View>
  );
}


const MyExpenses = () => {
  const [isPersonalExpensesVisible, setIsPersonalExpensesVisible] = useState(false);
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
    if (personalExpenses.length === 0) {
      fetchPersonalExpenses();
      setBuffering(true);
    }
  }, [isPersonalExpensesVisible])

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
    paddingVertical: 8,
    paddingHorizontal: 16,
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
});


const expensesStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingBottom: 48
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
  },
  icon: {
    paddingVertical: 8,
    paddingLeft: 24,
    paddingRight: 32,
    width: 40,
    height: 40,
  },
  contentView: {
    display: 'flex',
    flexDirection: 'column',
  },
  line: {
    height: 2,
    width: '50%',
    backgroundColor: '#0F172A',
    marginTop: 4,
  },
});


export default MyExpenses;
