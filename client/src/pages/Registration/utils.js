/**
 * Regular expression for validating email
 * 
 * @param {String} email
 * @returns boolean
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Regular expression for validating password
 * 
 * @param {String} password
 * @returns Boolean
 */
export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/;

    return passwordRegex.test(password);
}
