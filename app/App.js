import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Tabs } from './Tabs';


import { Toast } from './components/Toast';


const App = () => {
  const [toast, setToast] = useState(null);

  return (
    <NavigationContainer>
      <Tabs setToast={setToast} />
      {toast && <Toast toast={toast} setToast={setToast} />}
    </NavigationContainer>
  );
}


export default App;
