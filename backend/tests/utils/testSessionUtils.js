import { coordinator, genericPrescriber } from "./sampleData.js"
import { SERVER } from "../../constants.js"
import { ACCOUNT_TYPE } from "../../types/userServiceTypes.js"

const SERVER_URL = `http://localhost:${SERVER.PORT}`

/**
 * Returns a token used for auth for the default coordinator.
 * 
 * Prerequisite: the default coordinator must be defined in the db
 * before calling this function
 * @returns token for default coordinator. Null if the login fails.
 */
export const loginAsDefaultCoordinator = async () => {
    let res = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...coordinator,
            accountType: ACCOUNT_TYPE.ADMIN
        })
    })
    
    if(res.status != 200) {
        return null;
    }

    let resBody = await res.json();
    return resBody.token;
}

/**
 * Returns a token used for auth for the default prescriber.
 * 
 * Prerequisite: the default prescriber must be defined in the db
 * before calling this function
 * @returns token for default prescriber. Null if the login fails.
 */
export const loginAsDefaultPrescriber = async () => {
    let res = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...genericPrescriber,
            accountType: ACCOUNT_TYPE.PRESCRIBER
        })
    })
    
    if(res.status != 200) {
        return null;
    }

    let resBody = await res.json();
    return resBody.token;
}

