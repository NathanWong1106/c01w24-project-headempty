import { clearDB, closeConn, connect, insertPrescriberPrescriptions, insertPrescribers } from "../utils/dbUtils.js";
import { SERVER } from "../../constants.js";
import { loginAsDefaultPrescriber } from "../utils/testSessionUtils.js";
import { fetchAsPrescriber } from "../utils/fetchUtils.js"; 

const SERVER_URL = `http://localhost:${SERVER.PORT}`;
let prescriberToken = null;

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
            search: { providerCode: searchProviderCode },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsPrescriber(prescriberToken, "/prescriber/getPaginatedPrescriptions", "POST", body);
        expect(res.status).toBe(200);

        let resBody = await res.json();
        expect(resBody.list.length).toBe(20);
    }
})

test("/prescriber/getPaginatedPrescriptions - wrong prescriber code check", async () => {
    await insertPrescriberPrescriptions(40);

    const searchProviderCode = "Should not find anything";

    for (let page = 1; page <= 2; page++) {
        const body = {
            page: page,
            pageSize: 20,
            search: { providerCode: searchProviderCode },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsPrescriber(prescriberToken, "/prescriber/getPaginatedPrescriptions", "POST", body);
        expect(res.status).toBe(200);

        let resBody = await res.json();
        expect(resBody.list.length).toBe(0);
    }
})

test("postSinglePrescription - should return success response", async () => {
    const providerCode = "ON-JC001";
    const prscn_date = "2021-10-01";
    const patientInit = "JL";
    const postObj = { providerCode: "ON-JC001", date: "2021-10-01", initial: "JL", prescribed: true, status: ""};

    const res = await fetchAsPrescriber(prescriberToken, "/prescriber/postPrescription", "POST", { providerCode, prscn_date, patientInit, postObj });

    expect(res.status).toBe(200);
});

test("postSinglePrescription - should return error response for missing initials", async () => {
    // Mock the necessary data
    const providerCode = "ON-JC000";
    const prscn_date = "";
    const patientInit = "";
    const postObj = { providerCode: "ON-JC001", date: "2021-10-01", initial: "", prescribed: true, status: ""};

    // Call the function being tested
    const res = await fetchAsPrescriber(prescriberToken, "/prescriber/postPrescription", "POST", { providerCode, prscn_date, patientInit, postObj })

    // Assert the response
    expect(res.status).toBe(400);
    const responseBody = await res.json();
    expect(responseBody.error).toBe("Provider Code, Prescription Date and Patient Initials must be provided");
});
