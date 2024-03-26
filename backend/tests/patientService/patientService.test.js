import { clearDB, closeConn, connect, insertPatient, insertPatientPrescriptions } from "../utils/dbUtils.js";
import { SERVER } from "../../constants.js";
import { loginAsDefaultPatient } from "../utils/testSessionUtils.js";
import { fetchAsPatient } from "../utils/fetchUtils.js"; 

const SERVER_URL = `http://localhost:${SERVER.PORT}`;
let patientToken = null;

beforeAll(async () => {
    await connect();
    await clearDB(true);
    await insertPatient();

    patientToken = await loginAsDefaultPatient();

    if (patientToken === null) {
        fail('Login failed.');
    }
})

beforeEach(async () => {
    // Clear db (don't clear patient user)
    await clearDB(true, true, false);
})

afterAll(async () => {
    await closeConn();
})

test("/patient/getPaginatedPrescriptions - gets all patient paginated Prescriptions", async () => {
    await insertPatientPrescriptions(40);

    const email = "patient1@gmail.com";

    for (let page = 1; page <= 2; page++) {
        const body = {
            page: page,
            pageSize: 20,
            search: { email: email },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsPatient(patientToken, "/patient/getPaginatedPrescriptions", "POST", body);
        expect(res.status).toBe(200);

        let resBody = await res.json();
        expect(resBody.list.length).toBe(20);
    }
})

test("/patient/getPaginatedPrescriptions - wrong patient email check", async () => {
    await insertPatientPrescriptions(40);

    const email = "patient1@gmail.com wrong";

    for (let page = 1; page <= 2; page++) {
        const body = {
            page: page,
            pageSize: 20,
            search: { email: email },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsPatient(patientToken, "/patient/getPaginatedPrescriptions", "POST", body);
        expect(res.status).toBe(200);

        let resBody = await res.json();
        expect(resBody.list.length).toBe(0);
    }
})
