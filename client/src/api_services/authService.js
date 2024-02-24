/**
 * Attempts to log the user in returns a user object if successful, else null.
 * @param {string} email 
 * @param {string} password 
 * @returns a user object if successful, else null.
 */
export const loginAndSetStore = async (email, password) => {

    //temp test fail
    if(email == "testFail") {
        return null;
    }
    
    //TODO
    return{};
}