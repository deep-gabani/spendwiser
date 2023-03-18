import { apiBaseUrl } from './config';


const submitExpenseImage = async ( imageName, base64Image ) => {
  const url = `${apiBaseUrl}/process-expense-image`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'base64_image': base64Image,
        'image_name': imageName,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error submitting expense:', error);
    throw error;
  }
};


export {
    submitExpenseImage,
};
