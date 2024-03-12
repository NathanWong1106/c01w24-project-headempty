import { SERVER } from "../../constants.js";

const SERVER_URL = `http://localhost:${SERVER.PORT}`;

export const fetchAsAdmin = async (adminToken, endpoint, method, body) => {
    return await fetch(`${SERVER_URL}${endpoint}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(body)
    })
}

export const fetchAsPrescriber = async (prescriberToken, endpoint, method, body) => {
    return await fetch(`${SERVER_URL}${endpoint}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${prescriberToken}`
        },
        body: JSON.stringify(body)
    })
}