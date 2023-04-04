import moment from 'moment';


const validatePhoneNumber = (inputText) => {
    const phoneNumberRegex = /^[1-9]\d{9}$/; // 10-digit phone number without leading 0
    return phoneNumberRegex.test(inputText);
};


const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email address format
    return emailRegex.test(email);
}


const parseDateTime = (datetime) => {
    return moment(datetime).format('Do MMMM, YYYY HH:mm');
}


const capitalizeString = (string) => {
    const words = string.split(" ");
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedWords.join(" ");
}
  

export {
    validatePhoneNumber,
    validateEmail,
    parseDateTime,
    capitalizeString,
};
