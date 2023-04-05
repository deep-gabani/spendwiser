import moment from 'moment';
import { S3 } from 'aws-sdk';
import { awsAccessKey, awsSecretKey } from './config';

const s3 = new S3({
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
});


const validatePhoneNumber = (inputText) => {
    const phoneNumberRegex = /^[1-9]\d{9}$/; // 10-digit phone number without leading 0
    return phoneNumberRegex.test(inputText);
};


const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email address format
    return emailRegex.test(email);
}


const parseDateTime = ( datetime, format = 'Do MMMM, YYYY HH:mm', len = -1 ) => {
    const dateString = moment(datetime).format(format);
    if (len === -1) {
        return dateString;
    }
    return dateString.substring(0, len);
}


const capitalizeString = (string) => {
    const words = string.split(" ");
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedWords.join(" ");
}

const beautifyMobileNo = (phone_no) => {
    const country_code = phone_no.substring(0, 3);
    const first_five_digits = phone_no.substring(3, 8);
    const last_five_digits = phone_no.substring(8);

    return `${country_code} ${first_five_digits}-${last_five_digits}`
}


function parseS3ImageUri(uri) {
    const regex = /^s3:\/\/([^/]+)\/(.+)\.([^.]+)$/;
    const matches = uri.match(regex);
    
    if (!matches) {
      throw new Error('Invalid S3 URI');
    }
    
    return {
      bucketName: matches[1],
      key: `${matches[2]}.${matches[3]}`,
      extension: matches[3]
    };
}


const getS3Image = async (uri) => {
    const { bucketName, key, extension } = parseS3ImageUri(uri);
    
    s3.getObject({Bucket: bucketName, Key: key}, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        return `data:image/jpeg;base64,${data.Body.toString('base64')}`;
      }
    });

    try {
        const data = await s3.getObject({Bucket: bucketName, Key: key}).promise();
        const imageSrc = `data:image/${extension};base64,${data.Body.toString('base64')}`;
        return imageSrc;
    } catch (err) {
        console.log('Error downloading image from S3:', err);
        throw err;
    }
}


export {
    validatePhoneNumber,
    validateEmail,
    parseDateTime,
    capitalizeString,
    beautifyMobileNo,
    getS3Image,
};
