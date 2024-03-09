import { jest } from '@jest/globals'

import { clearDB, closeConn, connect, insertAdmins } from "../utils/dbUtils.js";
import { loginAsDefaultCoordinator } from "../utils/testSessionUtils.js";
import { fetchAsAdmin } from "../utils/fetchUtils.js";

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

afterEach(() => {
    jest.restoreAllMocks();
})

afterAll(async () => {
    await closeConn();
})

test("/verification/verifyPrescribers - valid input data", async () => {
    const prescriber = {
        firstName: "Alex",
        lastName: "Steve",
        province: "NS",
        licensingCollege: "College of Physicians and Surgeons of Nova Scotia",
        licenceNumber: "80085",
    }

    const res = await fetchAsAdmin(
        adminToken,
        "/verification/verifyPrescribers",
        "POST",
        {
            prescribers: [prescriber]
        },
    );
    expect(res.status).toBe(200);
});

test("/verification/verifyPrescribers - empty input array", async () => {
    const res = await fetchAsAdmin(
        adminToken,
        "/verification/verifyPrescribers",
        "POST",
        {
            prescribers: []
        },
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.verified).toHaveLength(0);
    expect(data.invalid).toHaveLength(0);
    expect(data.error).toHaveLength(0);
});

test("/verification/verifyPrescribers - null input data", async () => {
    const res = await fetchAsAdmin(
        adminToken,
        "/verification/verifyPrescribers",
        "POST",
        {
            noPrescriberData: "wowwee"
        },
    );
    expect(res.status).toBe(400);
});

test("/verification/verifyPrescribers - input data not matching schema", async () => {
    const notPrescriber = {
        name: "Bob",
        city: "Down under",
        university: "University of Rizzland",
        sinNumber: "177013",
    }
    const res = await fetchAsAdmin(
        adminToken,
        "/verification/verifyPrescribers",
        "POST",
        {
            prescribers: [notPrescriber]
        },
    );
    expect(res.status).toBe(400);
});