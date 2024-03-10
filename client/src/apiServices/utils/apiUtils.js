import { SERVER_ADDRESS } from "./constants"

export const callEndpoint = async (path, method, body) => {
    return await fetch(`${SERVER_ADDRESS}${path}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
}