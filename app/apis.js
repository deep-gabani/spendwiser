import { apiBaseUrl, awsApiStageName } from './config';
import { getState } from './store';


const submitExpenseImage = async ({ s3_image_uri }) => {
  const url = `${apiBaseUrl}/${awsApiStageName}/start-processing-expense-image`;
  const { user } = getState();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'phone_number': user['phone_number'],
        's3_image_uri': s3_image_uri,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error submitting expense:', error);
    throw error;
  }
};


const sendOtp = async ({ phone_number }) => {
  const url = `${apiBaseUrl}/${awsApiStageName}/user/send-otp`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'resource': '/send-otp',
        'body': {
          'phone_number': phone_number,
        }
      })
    });
    const data = await response.json();

    // // When you want to not call for the OTP...
    // const data = {
    //   statusCode: 200,
    //   body: {
    //     'message': `OTP sent successfully to ${phone_number}.`,
    //     'message_id': '123',
    //     'otp': '123456'
    //   }
    // }
    return data;
  } catch (error) {
    console.log('Error sending OTP:', error);
    throw error;
  }
}


const signup = async ({ first_name, last_name, phone_number, email }) => {
  const url = `${apiBaseUrl}/${awsApiStageName}/user/signup`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'resource': '/signup',
        'body': {
          'first_name': first_name,
          'last_name': last_name,
          'phone_number': phone_number,
          'email': email,
        }
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error signing up:', error);
    throw error;
  }
}


const login = async ({ phone_number }) => {
  const url = `${apiBaseUrl}/${awsApiStageName}/user/login`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'resource': '/login',
        'body': {
          'phone_number': phone_number,
        }
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error loggin in:', error);
    throw error;
  }
}


export {
    submitExpenseImage,
    sendOtp,
    signup,
    login
};
