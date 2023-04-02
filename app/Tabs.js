import React, { createContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyExpenses from './MyExpenses';
import AddExpense from './AddExpense';
import MyProfile from './MyProfile';
import { useFonts, Raleway_500Medium } from '@expo-google-fonts/raleway';
import { ToastContext } from './components/Toast';


const Tab = createBottomTabNavigator();


const Tabs = ({ setToast }) => {

  let [fontsLoaded] = useFonts({
    Raleway_500Medium,
  });
  
  if(!fontsLoaded) {
    return null;
  }

  return (
    <ToastContext.Provider value={setToast}>
      <Tab.Navigator
        initialRouteName="My Expenses"
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
    </ ToastContext.Provider>
  );
}


export {
    Tabs,
    ToastContext,
};