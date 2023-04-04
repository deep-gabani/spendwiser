import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyExpenses from './MyExpenses';
import AddExpense from './AddExpense';
import MyProfile from './MyProfile';
import { useFonts, Raleway_500Medium } from '@expo-google-fonts/raleway';
import { SharedContext } from './store';


const Tab = createBottomTabNavigator();


const Tabs = ({ setToast, setBuffering }) => {

  let [fontsLoaded] = useFonts({
    Raleway_500Medium,
  });
  
  if(!fontsLoaded) {
    return null;
  }

  return (
    <SharedContext.Provider value={{ setToast: setToast, setBuffering: setBuffering }}>
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
    </ SharedContext.Provider>
  );
}


export {
    Tabs,
    SharedContext,
};