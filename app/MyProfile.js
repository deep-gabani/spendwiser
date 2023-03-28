import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, TextInput, ToastAndroid } from 'react-native';
import { useFonts, Raleway_300Light, Raleway_500Medium, Raleway_700Bold, Raleway_900Black } from '@expo-google-fonts/raleway';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Zocial } from '@expo/vector-icons';
import { getState, setState } from './store';
import { validatePhoneNumber, validateEmail } from './utils';
import * as apis from './apis.js';


const windowWidth = Dimensions.get('window').width;


const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}


const OtpScreen = ({ phone_number, otp, set_otp, otp_sent, sendOtp, uponOtpVerification }) => {

  const verifyOtp = () => {
    if (otp === otp_sent) {
      // OTP validation succeeded...
      uponOtpVerification();
    } else {
      ToastAndroid.show('Incorrect OTP! Try again.', ToastAndroid.SHORT);
      return;
    }
  }

  return (
    <ScrollView style={loginStyles.container}>
      <View style={loginStyles.otpView}>
        <Text style={loginStyles.otpLabel}>Enter your OTP from {phone_number}</Text>
        <TextInput
          style={loginStyles.otpInput}
          placeholder="- - - - - -"
          onChangeText={set_otp}
          value={otp}
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      <TouchableOpacity style={loginStyles.button} onPress={verifyOtp}>
        <Text style={loginStyles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <View style={loginStyles.otpTextView}>
        <View style={loginStyles.resendOtpView}>
          <Text style={loginStyles.resendOtpText}>Didn't receive an OTP? </Text>
          <TouchableOpacity onPress={sendOtp}>
            <Text style={loginStyles.resendOtpLinkText}>Resend OTP</Text>
          </TouchableOpacity>
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

  const sendOtp = async () => {
    const response = await apis.sendOtp({ phone_number: `+91${phone_number}`});
    if ( response["statusCode"] === 200) {
      const { message, messge_id, otp: otp_sent } = response["body"];
      ToastAndroid.show(message, ToastAndroid.SHORT);
      set_otp_sent(otp_sent);
    }
  }

  const handleSignup = async () => {
    // Checking for first name...
    if (!first_name) {
      ToastAndroid.show('Please enter your first name!', ToastAndroid.SHORT);
      return;
    }

    // Checking for last name...
    if (!last_name) {
      ToastAndroid.show('Please enter your last name!', ToastAndroid.SHORT);
      return;
    }

    // Validating the phone number...
    if (!validatePhoneNumber(phone_number)) {
      ToastAndroid.show('Please enter a valid phone number!', ToastAndroid.SHORT);
      return;
    }

    // Validating email...
    if (!validateEmail(email)) {
      ToastAndroid.show('Please enter a valid email!', ToastAndroid.SHORT);
      return;
    }


    // Sending OTP...
    await sendOtp();
    set_show_otp_screen(true);
  };

  
  const uponOtpVerification = async () => {
    // Signup the user...
    const response = await apis.signup({ first_name: first_name, last_name: last_name, phone_number: `+91${phone_number}`, email: email });
    ToastAndroid.show(response["body"]["message"], ToastAndroid.SHORT);
    if ( response["statusCode"] === 200 ) {
      setState({ user: response["body"]["user"] });
      refreshScreen();
    } else if ( response["statusCode"] === 500 ) {
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
      <ScrollView style={loginStyles.container}>

        <View style={loginStyles.userNameView}>
          <View style={loginStyles.userNameChildView}>
            <Text style={loginStyles.userNameLabel}>First Name</Text>
            <TextInput
              style={loginStyles.userNameInput}
              placeholder="Deep"
              onChangeText={set_first_name}
              value={first_name}
            />
          </View>
          <View style={loginStyles.userNameChildView}>
            <Text style={loginStyles.userNameLabel}>Last Name</Text>
            <TextInput
              style={{...loginStyles.userNameInput, ...loginStyles.last_nameInput}}
              placeholder="Gabani"
              onChangeText={set_last_name}
              value={last_name}
            />
          </View>
        </View>
        
        <View style={loginStyles.phoneView}>
          <Text style={loginStyles.phone_numberLabel}>Phone Number</Text>
          <View style={loginStyles.phoneInputView}>
            <Text style={loginStyles.phone_numberCountryCodeLabel}>+91</Text>
            <TextInput
              style={loginStyles.phone_numberInput}
              placeholder="70486 34600"
              onChangeText={set_phone_number}
              value={phone_number}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <View style={loginStyles.emailView}>
          <Text style={loginStyles.emailLabel}>Email</Text>
          <TextInput
            style={loginStyles.emailInput}
            placeholder="deepgabani@gmail.com"
            onChangeText={set_email}
            value={email}
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity style={loginStyles.button} onPress={handleSignup}>
          <Text style={loginStyles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <View style={loginStyles.orView}>
          <View style={loginStyles.orDashedLine} />
          <Text style={loginStyles.orText}>or</Text>
          <View style={loginStyles.orDashedLine} />
        </View>

        <View style={loginStyles.oneClickLoginView}>
          <TouchableOpacity style={{...loginStyles.button, ...loginStyles.disabled}}onPress={() => {}}>
            <Ionicons name="logo-google" size={24} color="#0F172A" />
            <Text style={loginStyles.buttonText}>  Signup with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...loginStyles.button, ...loginStyles.disabled}} onPress={() => {}}>
            <Zocial name="facebook" size={24} color="#0F172A" />
            <Text style={loginStyles.buttonText}>  Signup with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...loginStyles.button, ...loginStyles.disabled}} onPress={() => {}}>
            <Ionicons name="logo-apple" size={24} color="#0F172A" />
            <Text style={loginStyles.buttonText}>  Signup with Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.signupTextView}>
          <Text style={loginStyles.signupText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => setShowSignupScreen(false)}>
            <Text style={loginStyles.signupLinkText}>Login</Text>
          </TouchableOpacity>
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

  const sendOtp = async () => {
    const response = await apis.sendOtp({ phone_number: `+91${phone_number}`});
    if ( response["statusCode"] === 200) {
      const { message, messge_id, otp: otp_sent } = response["body"];
      console.log(response["body"]);
      ToastAndroid.show(message, ToastAndroid.SHORT);
      set_otp_sent(otp_sent);
    }
  }

  const handleLogin = async () => {
    if (!validatePhoneNumber(phone_number)) {
      ToastAndroid.show('Please enter a valid phone number', ToastAndroid.SHORT);
      return;
    }


    // Sending OTP...
    await sendOtp();
    set_show_otp_screen(true);
  };

  
  const uponOtpVerification = async () => {
    // Signup the user...
    const response = await apis.login({ phone_number: `+91${phone_number}` });
    ToastAndroid.show(response["body"]["message"], ToastAndroid.SHORT);
    if ( response["statusCode"] === 200 ) {
      setState({ user: response["body"]["user"] });
      refreshScreen();
    } else if ( response["statusCode"] === 500 ) {
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
      <ScrollView style={loginStyles.container}>
        
        <Text style={loginStyles.phone_numberLabel}>Phone Number</Text>
        <View style={loginStyles.phoneInputView}>
          <Text style={loginStyles.phone_numberCountryCodeLabel}>+91</Text>
          <TextInput
            style={loginStyles.phone_numberInput}
            placeholder="70486 34600"
            onChangeText={set_phone_number}
            value={phone_number}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <TouchableOpacity style={loginStyles.button} onPress={handleLogin}>
          <Text style={loginStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={loginStyles.orView}>
          <View style={loginStyles.orDashedLine} />
          <Text style={loginStyles.orText}>or</Text>
          <View style={loginStyles.orDashedLine} />
        </View>

        <View style={loginStyles.oneClickLoginView}>
          <TouchableOpacity style={{...loginStyles.button, ...loginStyles.disabled}}onPress={() => {}}>
            <Ionicons name="logo-google" size={24} color="#0F172A" />
            <Text style={loginStyles.buttonText}>  Login with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...loginStyles.button, ...loginStyles.disabled}} onPress={() => {}}>
            <Zocial name="facebook" size={24} color="#0F172A" />
            <Text style={loginStyles.buttonText}>  Login with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...loginStyles.button, ...loginStyles.disabled}} onPress={() => {}}>
            <Ionicons name="logo-apple" size={24} color="#0F172A" />
            <Text style={loginStyles.buttonText}>  Login with Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.signupTextView}>
          <Text style={loginStyles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={setShowSignupScreen}>
            <Text style={loginStyles.signupLinkText}>Sign up</Text>
          </TouchableOpacity>
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
      <ScrollView style={profileStyles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={profileStyles.innerContainer}>
          <View style={profileStyles.usernameBanner}>
            <Text style={profileStyles.usernameBannerPrefix}>Welcome, </Text>
            <Text style={profileStyles.usernameBannerName}>{first_name}!</Text>
          </View>

          <TouchableOpacity style={profileStyles.logoutButton} onPress={handleLogout}>
            <Text style={profileStyles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
  phone_numberInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    margin: 8,
    width: '80%',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 24,
  },
});


const loginStyles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingBottom: 48,
  },
  phone_numberLabel: {
    fontFamily: 'Raleway_300Light'
  },
  phoneInputView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  phone_numberCountryCodeLabel: {
    fontFamily: 'Raleway_300Light',
    fontSize: 24,
    paddingVertical: 16,
    paddingLeft: 16,
    borderWidth: 1,
    marginVertical: 4,
    borderRightWidth: 0
  },
  phone_numberInput: {
    flex: 1,
    fontSize: 24,
    padding: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    fontFamily: 'Raleway_700Bold',
    borderLeftWidth: 0
  },
  button: {
    padding: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#0F172A',
    fontFamily: 'Raleway_700Bold',
  },
  signupTextView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
  },
  userNameChildView: {
    flex: 1
  },
  userNameLabel: {
    fontFamily: 'Raleway_300Light'
  },
  userNameInput: {
    fontSize: 24,
    padding: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    fontFamily: 'Raleway_700Bold',
  },
  last_nameInput: {
    borderLeftWidth: 0
  },
  emailLabel: {
    fontFamily: 'Raleway_300Light' 
  },
  emailInput: {
    fontSize: 24,
    padding: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    fontFamily: 'Raleway_700Bold',
  },
  otpLabel: {
    fontFamily: 'Raleway_300Light'
  },
  otpInput: {
    flex: 1,
    fontSize: 24,
    padding: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: 8,
    marginVertical: 4,
    fontFamily: 'Raleway_700Bold',
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
  disabled: {
    opacity: 0.25
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
    paddingVertical: 8,
  },
  innerContainer: {
    flex: 1,
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
  logoutButton: {
    padding: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    marginBottom: 16
  },
  logoutButtonText: {
    color: '#0F172A',
    fontFamily: 'Raleway_700Bold',
  },
});


export default MyProfile;
