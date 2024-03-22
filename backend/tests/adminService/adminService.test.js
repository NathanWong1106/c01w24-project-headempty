import { clearDB, closeConn, connect, insertAdmins, insertPrescribers, insertPrescriberPrescriptions } from "../utils/dbUtils.js";
import { loginAsDefaultCoordinator } from "../utils/testSessionUtils.js";
import { fetchAsAdmin } from "../utils/fetchUtils.js";
import { PRESCRIBER_PRESCRIPTION_STATUS } from "../../types/prescriptionTypes.js";

let adminToken = null;

beforeAll(async () => {
    await connect();
    await clearDB(true);
    await insertAdmins();
    adminToken = await loginAsDefaultCoordinator();

    if (adminToken === null) {
        fail('Login failed.');
    }
})

beforeEach(async () => {
    // Clear db (don't clear admin user)
    await clearDB(false);
})

afterAll(async () => {
    await closeConn();
})

test("/admin/getPaginatedPrescribers - gets all prescribers paginated, no search", async () => {
    await insertPrescribers(40);

    for (let page = 1; page <= 2; page++) {
        const body = {
            page: page,
            pageSize: 20,
            search: {}
        }

        let res = await fetchAsAdmin(adminToken, "/admin/getPaginatedPrescribers", "POST", body);
        expect(res.status).toBe(200);

        let resBody = await res.json();
        expect(resBody.list.length).toBe(20);
    }
})

test("/admin/getPaginatedPrescribers - gets all prescribers paginated, with search", async () => {
    await insertPrescribers(20);

    const searchEmail = "prescriber1@gmail.com";
    const searchProviderCode = "ON-JC001";

    const body = {
        page: 1,
        pageSize: 20,
        search: {
            email: searchEmail,
            providerCode: searchProviderCode,
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            password: "this should also be ignored"
        }
    }

    let res = await fetchAsAdmin(adminToken, "/admin/getPaginatedPrescribers", "POST", body);
    expect(res.status).toBe(200);

    let resBody = await res.json();
    expect(resBody.list.length).toBe(1);
    expect(resBody.list[0].email).toBe(searchEmail);
    expect(resBody.list[0].providerCode).toBe(searchProviderCode);
})

test("/admin/patchPrescriber - patches correct prescriber and protects providerCode", async () => {
    await insertPrescribers(20);

    const targetProviderCode = "ON-JC001";
    const patches = {
        email: "patchedEmail",
        profession: "lawyer",
        providerCode: "provider code can't be changed"
    }
    const patchBody = {
        providerCode: targetProviderCode,
        patches: patches
    }

    // Patch prescriber
    let res = await fetchAsAdmin(adminToken, "/admin/patchPrescriber", "PATCH", patchBody);
    expect(res.status).toBe(200);

    const getPageBody = {
        page: 1,
        pageSize: 20,
        search: { email: patches.email }
    }

    // Get resulting list and search for the newly patched prescriber
    res = await fetchAsAdmin(adminToken, "/admin/getPaginatedPrescribers", "POST", getPageBody);
    expect(res.status).toBe(200);

    let resBody = await res.json();
    let retPrescriber = resBody.list[0];
    expect(resBody.list.length).toBe(1);
    expect(retPrescriber.email).toBe(patches.email);
    expect(retPrescriber.profession).toBe(patches.profession);
    expect(retPrescriber.providerCode).toBe(targetProviderCode);
})

test("/admin/getAdminPaginatedPrescriberPrescriptions - gets all prescribers paginated Prescription", async () => {
    await insertPrescriberPrescriptions(40);

    for (let page = 1; page <= 2; page++) {
        const body = {
            page: page,
            pageSize: 20,
            search: {},
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsAdmin(adminToken, "/admin/getAdminPaginatedPrescriberPrescriptions", "POST", body);
        expect(res.status).toBe(200);

        let resBody = await res.json();
        expect(resBody.list.length).toBe(20);
    }
})

test("/admin/getAdminPrescriberPrescriptions - no results", async () => {
    await insertPrescriberPrescriptions(40);

    const searchProviderCode = "Should not find anything";

    for (let page = 1; page <= 2; page++) {
        const body = {
            page: page,
            pageSize: 20,
            search: { providerCode: searchProviderCode },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsAdmin(adminToken, "/admin/getAdminPaginatedPrescriberPrescriptions", "POST", body);
        expect(res.status).toBe(200);

        let resBody = await res.json();
        expect(resBody.list.length).toBe(0);
    }
})

test("/admin/patchSinglePrescriberPrescription - patches correct prescriber prescription", async () => {
    await insertPrescriberPrescriptions(20);

    const targetProviderCode = "ON-JC001";
    const targetInitial = "JC";
    const targetDate = "2024-12-10";
    const patches = {
        "prescribed": true,
        "status": PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE
    }
    const patchBody = {
        providerCode: targetProviderCode,
        initial: targetInitial,
        date: targetDate,
        patches: patches
    }

    // Patch prescriber
    let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
    expect(res.status).toBe(200);

    const getPageBody = {
        page: 1,
        pageSize: 20,
        search: {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
        }
    }

    // Get resulting list and search for the newly patched prescriber
    res = await fetchAsAdmin(adminToken, "/admin/getAdminPaginatedPrescriberPrescriptions", "POST", getPageBody);
    expect(res.status).toBe(200);

    let resBody = await res.json();
    let retPrescriber = resBody.list[0];
    expect(resBody.list.length).toBe(1);
    expect(retPrescriber.prescribed).toBe(patches.prescribed);
    expect(retPrescriber.status).toBe(patches.status);
})

test("/admin/patchSinglePrescriberPrescription - invalid patch body, null fields", async () => {
    await insertPrescriberPrescriptions(20);

    const targetProviderCode = "ON-JC001";
    const targetInitial = null;
    const targetDate = "2024-12-10";
    const patches = {
        "prescribed": true,
        "status": PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE
    }
    const patchBody = {
        providerCode: targetProviderCode,
        initial: targetInitial,
        date: targetDate,
        patches: patches
    }

    // Patch prescriber
    let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
    expect(res.status).toBe(400);
})

test("/admin/patchSinglePrescriberPrescription - invalid patch body, empty fields", async () => {
    await insertPrescriberPrescriptions(20);

    const targetProviderCode = "ON-JC001";
    const targetInitial = "";
    const targetDate = "";
    const patches = {
        "prescribed": true,
        "status": PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE
    }
    const patchBody = {
        providerCode: targetProviderCode,
        initial: targetInitial,
        date: targetDate,
        patches: patches
    }

    // Patch prescriber
    let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
    expect(res.status).toBe(400);
})

test("/admin/patchSinglePrescriberPrescription - fails to find prescriber prescription", async () => {
    await insertPrescriberPrescriptions(20);

    const targetProviderCode = "ON-JC001";
    const targetInitial = "GG";
    const targetDate = "2024-12-69";
    const patches = {
        "prescribed": true,
        "status": PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE
    }
    const patchBody = {
        providerCode: targetProviderCode,
        initial: targetInitial,
        date: targetDate,
        patches: patches
    }

    // Patch prescriber
    let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
    expect(res.status).toBe(404);
})