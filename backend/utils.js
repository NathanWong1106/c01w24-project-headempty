/**
 * Decorator/Wrapper for auto-retry on error
 * 
 * @param {Promise} promise 
 * @param {number} totalTries Number of attempts in total. Default = 3.
 * @param {number} delayTime Initial time in ms between tries (that ramps up with number of tries). Default = 1000.
 * @param {number} nthTry Note: shouldn't be manually set. Attempt iteration number.
 * @returns Promise
 */
export async function retryPromiseWithDelay(promise, totalTries=3, delayTime=1000, nthTry=totalTries) {
    try {
        const res = await promise;
        return res;
    } catch (e) {
        if (nthTry === 1) {
            return Promise.reject(e);
        }
        // increased delay between every try
        await new Promise(r => setTimeout(r, delayTime * (totalTries - nthTry + 1)));
        return retryPromiseWithDelay(promise, totalTries, delayTime, nthTry - 1);
    }
}