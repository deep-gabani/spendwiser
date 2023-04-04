import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyExpenses from './MyExpenses';
import AddExpense from './AddExpense';
import MyProfile from './MyProfile';
import { useFonts, Raleway_500Medium } from '@expo-google-fonts/raleway';
import { userLoggedIn, SharedContext } from './store';
import { useNavigation } from '@react-navigation/native';


const Tab = createBottomTabNavigator();


const Tabs = ({ setToast, setBuffering }) => {
  const navigation = useNavigation();
  const initialRouteName = userLoggedIn() ? 'My Expenses' : 'My Profile';

  let [fontsLoaded] = useFonts({
    Raleway_500Medium,
  });
  
  if(!fontsLoaded) {
    return null;
  }

  return (
    <SharedContext.Provider value={{ setToast: setToast, setBuffering: setBuffering, navigation: navigation }}>
      <Tab.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          tabBarActiveTintColor: '#0F172A',
          tabBarItemStyle: {
            margin: 6,
          },
          tabBarLabelStyle: {
            fontFamily: 'Raleway_500Medium'
          },
          headerShown: false
        }}
      >
        <Tab.Screen
          name="My Expenses"
          component={MyExpenses}
          options={{
            tabBarLabel: 'My Expenses',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="bookshelf" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Add Expense"
          component={AddExpense}
          options={{
            tabBarLabel: 'Add Expense',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cash-plus" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="My Profile"
          component={MyProfile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </ SharedContext.Provider>
  );
}


export {
    Tabs,
    SharedContext,
};