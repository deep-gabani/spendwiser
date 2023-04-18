const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email address format
    return emailRegex.test(email);
}

export {
    validateEmail,
};
