const validatePhoneNumber = (inputText) => {
    const phoneNumberRegex = /^[1-9]\d{9}$/; // 10-digit phone number without leading 0
    return phoneNumberRegex.test(inputText);
};


const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email address format
    return emailRegex.test(email);
}
  

export {
    validatePhoneNumber,
    validateEmail,
};
