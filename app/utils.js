import moment from 'moment';


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
  

export {
    validatePhoneNumber,
    validateEmail,
    parseDateTime,
    capitalizeString,
    beautifyMobileNo,
};
