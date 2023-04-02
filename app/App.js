import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Tabs } from './Tabs';


import Toast from './components/Toast';
import Buffering from './components/Buffering';


const App = () => {
  const [toast, setToast] = useState(null);
  const [buffering, setBuffering] = useState(false);

  return (
    <NavigationContainer>
      <Tabs setToast={setToast} setBuffering={setBuffering} />
      {toast && <Toast toast={toast} setToast={setToast} />}
      {buffering && <Buffering />}
    </NavigationContainer>
  );
}


export default App;
