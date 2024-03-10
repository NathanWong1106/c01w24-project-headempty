import { SERVER_ADDRESS } from "./constants"

let token = "";

export const setAPIToken = (newToken) => {
    token = newToken;
}

export const callEndpoint = async (path, method, body) => {
    return await fetch(`${SERVER_ADDRESS}${path}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
}

export const callProtectedEndpoint = async (path, method, body) => {
    return await fetch(`${SERVER_ADDRESS}${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
}