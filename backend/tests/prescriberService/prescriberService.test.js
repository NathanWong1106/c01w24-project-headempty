import { clearDB, closeConn, connect, insertPrescriberPrescriptions, insertPrescribers } from "../utils/dbUtils.js";
import { SERVER } from "../../constants.js";
import { loginAsDefaultPrescriber } from "../utils/testSessionUtils.js";

const SERVER_URL = `http://localhost:${SERVER.PORT}`;
let prescriberToken = null;

const fetchAsPrescriber = async (endpoint, method, body) => {
    return await fetch(`${SERVER_URL}${endpoint}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${prescriberToken}`
        },
        body: JSON.stringify(body)
    })
}

beforeAll(async () => {
    await connect();
    await clearDB(true);
    await insertPrescribers();

    prescriberToken = await loginAsDefaultPrescriber();

    if (prescriberToken === null) {
        fail('Login failed.');
    }
})

beforeEach(async () => {
    // Clear db (don't clear prescriber user)
    await clearDB(true, false);
})

afterAll(async () => {
    await closeConn();
})

test("/prescriber/getPaginatedPrescriptions - gets all prescribers paginated Prescription", async () => {
    await insertPrescriberPrescriptions(40);

    const searchProviderCode = "ON-JC001";

    for (let page = 1; page <= 2; page++) {
        const body = {
            page: page,
            pageSize: 20,
            providerCode: searchProviderCode,
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsPrescriber("/prescriber/getPaginatedPrescriptions", "POST", body);
        expect(res.status).toBe(200);

        let resBody = await res.json();
        expect(resBody.list.length).toBe(20);
    }
})
