import { connect, clearDB, insertAdmins, closeConn, insertPatients } from "../utils/dbUtils"
import { loginAsDefaultCoordinator } from "../utils/testSessionUtils"
import { fetchAsAdmin } from "../utils/fetchUtils";

let coordToken = null;

beforeAll(async () => {
    await connect();
    await clearDB();
    await insertAdmins();
    coordToken = await loginAsDefaultCoordinator();

    if (coordToken === null) {
        fail('Login failed.');
    }
})

beforeEach(async () => {
    await clearDB(false);
})

afterAll(async () => {
    await closeConn();
})

test("/coordinator/getPaginatedPatients - gets all patients paginated, no search", async () => {
    await insertPatients(40);

    for (let page = 1; page <= 2; page++) {
        const body = {
            page: page,
            pageSize: 20,
            search: {}
        }

        let res = await fetchAsAdmin(coordToken, "/coordinator/getPaginatedPatients", "POST", body);
        expect(res.status).toBe(200);

        let resBody = await res.json();
        expect(resBody.list.length).toBe(20);
    }
})

test("/coordinator/getPaginatedPatients - gets all patients paginated, with search", async () => {
    await insertPatients(40);

    const searchEmail = "patient1@gmail.com"

    const body = {
        page: 1,
        pageSize: 20,
        search: {
            email: searchEmail,
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            password: "this should also be ignored"
        }
    }

    let res = await fetchAsAdmin(coordToken, "/coordinator/getPaginatedPatients", "POST", body);
    expect(res.status).toBe(200);

    let resBody = await res.json();
    expect(resBody.list.length).toBe(1);
    expect(resBody.list[0].email).toBe(searchEmail);

})

test("/coordinator/patchPatient - patches correct patient and protects email", async () => {
    await insertPatients(20);

    const targetEmail = "patient1@gmail.com";
    const newFirstName = "billy";

    const patches = {
        email: "patchedEmail",
        firstName: newFirstName,
        thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        password: "this should also be ignored"
    }
    const patchBody = {
        email: targetEmail,
        patches: patches
    }

    // Patch patient
    let res = await fetchAsAdmin(coordToken, "/coordinator/patchPatient", "PATCH", patchBody);
    expect(res.status).toBe(200);

    const getPageBody = {
        page: 1,
        pageSize: 20,
        search: { email: targetEmail }
    }

    // Get resulting list and search for the newly patched patient
    res = await fetchAsAdmin(coordToken, "/coordinator/getPaginatedPatients", "POST", getPageBody);
    expect(res.status).toBe(200);

    let resBody = await res.json();
    let retPatient = resBody.list[0];
    expect(resBody.list.length).toBe(1);
    expect(retPatient.email).toBe(targetEmail);
    expect(retPatient.firstName).toBe(newFirstName);
    expect(retPatient.thisFieldShouldBeIgnored).toBe(undefined);
})