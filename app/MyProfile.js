import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Zocial } from '@expo/vector-icons';
import { getState, setState, SharedContext } from './store';
import { validatePhoneNumber, validateEmail } from './utils';
import * as apis from './apis.js';

import Button from './components/Button';
import TextBox from './components/TextBox';


const windowWidth = Dimensions.get('window').width;


const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}


const OtpScreen = ({ phone_number, otp, set_otp, otp_sent, sendOtp, uponOtpVerification }) => {
  const { setToast, setBuffering } = useContext(SharedContext);

  const verifyOtp = async () => {
    if (otp === otp_sent) {
      // OTP validation succeeded...
      setBuffering(true);
      await uponOtpVerification();
      setBuffering(false);
    } else {
      setToast({ text: 'Incorrect OTP! Try again.', severity: 'FAILURE' });
      return;
    }
  }

  return (
    <ScrollView>
      <View style={loginStyles.container}>

        <TextBox
          label={`Enter your OTP from ${phone_number}`}
          placeholder="- - - - - -"
          onChange={set_otp}
          value={otp}
          textInputProps={{ keyboardType: "numeric", maxLength: 6 }}
          textInputStyle={{ letterSpacing: 8, textAlign: 'center' }}
        />

        <Button
          text="Verify"
          onPress={verifyOtp}
        />

        <View style={loginStyles.otpTextView}>
          <View style={loginStyles.resendOtpView}>
            <Text style={loginStyles.resendOtpText}>Didn't receive an OTP? </Text>
            <TouchableOpacity onPress={sendOtp}>
              <Text style={loginStyles.resendOtpLinkText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}


const Signup = ({ refreshScreen, setShowSignupScreen }) => {
  const [phone_number, set_phone_number] = useState('');
  const [first_name, set_first_name] = useState('');
  const [last_name, set_last_name] = useState('');
  const [email, set_email] = useState('');
  const [otp, set_otp] = useState('');
  const [otp_sent, set_otp_sent] = useState('');
  const [show_otp_screen, set_show_otp_screen] = useState(false);
  const { setToast, setBuffering } = useContext(SharedContext);

  const sendOtp = async () => {
    const response = await apis.sendOtp({ phone_number: `+91${phone_number}`});
    if ( response["statusCode"] === 200) {
      const { message, messge_id, otp: otp_sent } = response["body"];
      setToast({ text: message, severity: 'SUCCESS' });
      set_otp_sent(otp_sent);
    }
  }

  const handleSignup = async () => {
    // Checking for first name...
    if (!first_name) {
      setToast({ text: 'Please enter your first name!', severity: 'WARNING' });
      return;
    }

    // Checking for last name...
    if (!last_name) {
      setToast({ text: 'Please enter your last name!', severity: 'WARNING' });
      return;
    }

    // Validating the phone number...
    if (!validatePhoneNumber(phone_number)) {
      setToast({ text: 'Please enter a valid phone number!', severity: 'WARNING' });
      return;
    }

    // Validating email...
    if (!validateEmail(email)) {
      setToast({ text: 'Please enter a valid email!', severity: 'WARNING' });
      return;
    }


    // Sending OTP...
    setBuffering(true);
    await sendOtp();
    set_show_otp_screen(true);
    setBuffering(false);
  };

  
  const uponOtpVerification = async () => {
    // Signup the user...
    const response = await apis.signup({ first_name: first_name, last_name: last_name, phone_number: `+91${phone_number}`, email: email });
    if ( response["statusCode"] === 200 ) {
      setState({ user: response["body"]["user"] });
      setToast({ text: response["body"]["message"], severity: 'SUCCESS' });
      refreshScreen();
    } else if ( response["statusCode"] === 500 ) {
      setToast({ text: response["body"]["message"], severity: 'FAILURE' });
      set_show_otp_screen(false);
      set_otp("");
      set_otp_sent("");
      set_phone_number("");
      set_email("");
    }
  }


  if (show_otp_screen) {
    return (
      <>
        <Header title="Signup" />
        <OtpScreen phone_number={phone_number} otp={otp} set_otp={set_otp} otp_sent={otp_sent} sendOtp={sendOtp} uponOtpVerification={uponOtpVerification} />
      </>
    )
  }


  return (
    <>
      <Header title="Signup" />
      <ScrollView>
        <View style={loginStyles.container}>
          <View style={loginStyles.userNameView}>
            <TextBox
              label="First Name"
              placeholder="Deep"
              onChange={set_first_name}
              value={first_name}
              textInputStyle={{ borderRightWidth: 0 }}
            />
            <TextBox
              label="Last Name"
              placeholder="Gabani"
              onChange={set_last_name}
              value={last_name}
            />
          </View>

          <TextBox
            label="Phone Number"
            placeholder="70486 34600"
            onChange={set_phone_number}
            value={phone_number}
            textInputProps={{ keyboardType: "phone-pad", maxLength: 10 }}
            prependTextInputLabel="+91"
          />

          <TextBox
            label="Email"
            placeholder="deepgabani@gmail.com"
            onChange={set_email}
            value={email}
            textInputProps={{ keyboardType: "email-address" }}
          />

          <Button
            text="Signup"
            onPress={handleSignup}
          />

          <View style={loginStyles.orView}>
            <View style={loginStyles.orDashedLine} />
            <Text style={loginStyles.orText}>or</Text>
            <View style={loginStyles.orDashedLine} />
          </View>

          <View style={loginStyles.oneClickLoginView}>
            <Button
              icon={<Ionicons name="logo-google" size={24} color="#0F172A" />}
              text="  Signup with Google"
              onPress={() => {}}
              buttonStyle={{ opacity: 0.25 }}
            />
            <Button
              icon={<Zocial name="facebook" size={24} color="#0F172A" />}
              text="  Signup with Facebook"
              onPress={() => {}}
              buttonStyle={{ opacity: 0.25 }}
            />
            <Button
              icon={<Ionicons name="logo-apple" size={24} color="#0F172A" />}
              text="  Signup with Apple"
              onPress={() => {}}
              buttonStyle={{ opacity: 0.25 }}
            />
          </View>

          <View style={loginStyles.signupTextView}>
            <Text style={loginStyles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => setShowSignupScreen(false)}>
              <Text style={loginStyles.signupLinkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </>
  );
}


const Login = ({ refreshScreen, setShowSignupScreen }) => {
  const [phone_number, set_phone_number] = useState('');
  const [otp, set_otp] = useState('');
  const [otp_sent, set_otp_sent] = useState('');
  const [show_otp_screen, set_show_otp_screen] = useState(false);
  const { setToast, setBuffering, navigation } = useContext(SharedContext);

  const sendOtp = async () => {
    const response = await apis.sendOtp({ phone_number: `+91${phone_number}`});
    if ( response["statusCode"] === 200) {
      const { message, messge_id, otp: otp_sent } = response["body"];
      setToast({ text: message, severity: 'SUCCESS' });
      set_otp_sent(otp_sent);
    }
  }

  const handleLogin = async () => {
    if (!validatePhoneNumber(phone_number)) {
      setToast({ text: 'Please enter a valid phone number!', severity: 'WARNING' });
      return;
    }

    // Sending OTP...
    setBuffering(true);
    await sendOtp();
    set_show_otp_screen(true);
    setBuffering(false);
  };

  
  const uponOtpVerification = async () => {
    // Signup the user...
    const response = await apis.login({ phone_number: `+91${phone_number}` });
    if ( response["statusCode"] === 200 ) {
      setToast({ text: response["body"]["message"], severity: 'SUCCESS' });
      setState({ user: response["body"]["user"] });
      refreshScreen();
      navigation.navigate('My Expenses');
    } else if ( response["statusCode"] === 500 ) {
      setToast({ text: response["body"]["message"], severity: 'FAILURE' });
      set_show_otp_screen(false);
      set_otp("");
      set_otp_sent("");
      set_phone_number("");
    }
  }


  if (show_otp_screen) {
    return (
      <>
        <Header title="Login" />
        <OtpScreen phone_number={phone_number} otp={otp} set_otp={set_otp} otp_sent={otp_sent} sendOtp={sendOtp} uponOtpVerification={uponOtpVerification} />
      </>
    )
  }

  return (
    <>
      <Header title="Login" />
      <ScrollView>
        
        <View style={loginStyles.container}>
          <TextBox
            label="Phone Number"
            placeholder="70486 34600"
            onChange={set_phone_number}
            value={phone_number}
            textInputProps={{ keyboardType: "phone-pad", maxLength: 10 }}
            prependTextInputLabel="+91"
          />

          <Button
            text="Login"
            onPress={handleLogin}
          />

          <View style={loginStyles.orView}>
            <View style={loginStyles.orDashedLine} />
            <Text style={loginStyles.orText}>or</Text>
            <View style={loginStyles.orDashedLine} />
          </View>

          <View style={loginStyles.oneClickLoginView}>
            <Button
              icon={<Ionicons name="logo-google" size={24} color="#0F172A" />}
              text="  Login with Google"
              onPress={() => {}}
              buttonStyle={{ opacity: 0.25 }}
            />
            <Button
              icon={<Zocial name="facebook" size={24} color="#0F172A" />}
              text="  Login with Facebook"
              onPress={() => {}}
              buttonStyle={{ opacity: 0.25 }}
            />
            <Button
              icon={<Ionicons name="logo-apple" size={24} color="#0F172A" />}
              text="  Login with Apple"
              onPress={() => {}}
              buttonStyle={{ opacity: 0.25 }}
            />
          </View>

          <View style={loginStyles.signupTextView}>
            <Text style={loginStyles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={setShowSignupScreen}>
              <Text style={loginStyles.signupLinkText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </>
  );
}


const ProfileView = ({ refreshScreen }) => {
  const { user } = getState();
  const { first_name, last_name, phone_number, email } = user;

  const handleLogout = () => {
    setState({ user: {} })
    refreshScreen();
  }

  return (
    <>
      <Header title="My Profile" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={profileStyles.container}>
          <View style={profileStyles.usernameBanner}>
            <Text style={profileStyles.usernameBannerPrefix}>Welcome, </Text>
            <Text style={profileStyles.usernameBannerName}>{first_name}!</Text>
          </View>

          <Button
            text="Logout"
            onPress={handleLogout}
            buttonStyle={{ marginBottom: 16 }}
          />
        </View>
      </ScrollView>
    </>
  )
}


const MyProfile = () => {
  // If user is logged int, then show the profile screen...
  const [showProfileScreen, setShowProfileScreen] = useState(JSON.stringify(getState()['user']) !== '{}');
  const [showSignupScreen, setShowSignupScreen] = useState(false);
  let [fontsLoaded] = useFonts({
    Raleway_300Light,
    Raleway_500Medium,
    Raleway_700Bold,
    Raleway_900Black,
  });
  
  if(!fontsLoaded) {
    return null;
  }


  // Call this function upon successful login...
  const refreshScreen = () => {
    const user = getState()['user'];
    setShowProfileScreen(JSON.stringify(user) !== '{}');
  }


  let currentView;
  if (!showProfileScreen) {
    // Show user login / signup screen...
    currentView = !showSignupScreen ? 
      <Login refreshScreen={refreshScreen} setShowSignupScreen={setShowSignupScreen} /> :
      <Signup refreshScreen={refreshScreen} setShowSignupScreen={setShowSignupScreen} />;
  } else {
    // Show user profile screen...
    currentView = <ProfileView refreshScreen={refreshScreen} />
  }


  return (
    <SafeAreaView style={styles.container}>
      {currentView}
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


const loginStyles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingBottom: 48,
    paddingHorizontal: 16,
  },
  signupTextView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  signupText: {
    fontFamily: 'Raleway_300Light',
  },
  signupLinkText: {
    fontFamily: 'Raleway_700Bold',
  },
  userNameView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    paddingTop: 8,
  },
  otpTextView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  otp_sentText: {
    fontFamily: 'Raleway_300Light',
  },
  resendOtpView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  resendOtpText: {
    fontFamily: 'Raleway_300Light',
  },
  resendOtpLinkText: {
    fontFamily: 'Raleway_700Bold',
  },
  orView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  orText: {
    fontFamily: 'Raleway_300Light',
    fontSize: 16,
    marginHorizontal: 8,
  },
  orDashedLine: {
    flex: 1,
    borderBottomWidth: 0.75,
    borderStyle: 'dashed',
    borderColor: '#0F172A',
    marginBottom: 8,
  },
});


const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  usernameBanner: {
    display: 'flex',
    flexDirection: 'row',
  },
  usernameBannerPrefix: {
    fontFamily: 'Raleway_300Light',
    fontSize: 16,
    textAlignVertical: 'bottom'
  },
  usernameBannerName: {
    fontFamily: 'Raleway_900Black',
    fontSize: 24,
  },
});


export default MyProfile;
