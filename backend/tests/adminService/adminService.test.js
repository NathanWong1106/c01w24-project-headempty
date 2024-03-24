import { clearDB, closeConn, connect, insertAdmins, insertPrescribers, insertPrescriberPrescriptions, insertPrescriberPrescription, insertPatientPrescriptions, insertPatientPrescription } from "../utils/dbUtils.js";
import { loginAsDefaultCoordinator } from "../utils/testSessionUtils.js";
import { fetchAsAdmin } from "../utils/fetchUtils.js";
import { PATIENT_PRESCRIPTION_STATUS, PRESCRIBER_PRESCRIPTION_STATUS } from "../../types/prescriptionTypes.js";
import { ConsoleMessage } from "puppeteer";

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

describe("/admin/getPaginatedPrescribers", () => {
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
});

describe("/admin/patchPrescriber", () => {
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
});

/*
PRESCRIBER PRESCRIPTIONS
*/


describe("/admin/getAdminPaginatedPrescriberPrescription", () => {
    test("/admin/getAdminPaginatedPrescriberPrescription - gets all prescribers paginated Prescription", async () => {
        await insertPrescriberPrescriptions(40);
    
        for (let page = 1; page <= 2; page++) {
            const body = {
                page: page,
                pageSize: 20,
                search: {},
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            }
            let res = await fetchAsAdmin(adminToken, "/admin/getAdminPaginatedPrescriberPrescription", "POST", body);
            expect(res.status).toBe(200);
    
            let resBody = await res.json();
            expect(resBody.list.length).toBe(20);
        }
    })

    test("/admin/getAdminPaginatedPrescriberPrescription - no results", async () => {
        await insertPrescriberPrescriptions(40);
    
        const searchProviderCode = "Should not find anything";
    
        for (let page = 1; page <= 2; page++) {
            const body = {
                page: page,
                pageSize: 20,
                search: { providerCode: searchProviderCode },
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            }
            let res = await fetchAsAdmin(adminToken, "/admin/getAdminPaginatedPrescriberPrescription", "POST", body);
            expect(res.status).toBe(200);
    
            let resBody = await res.json();
            expect(resBody.list.length).toBe(0);
        }
    })
});

describe("/admin/getAdminSinglePrescriberPrescription", () => {
    test("/admin/getAdminSinglePrescriberPrescription - gets valid prescriber prescription", async () => {
        await insertPrescriberPrescriptions(40);
    
        // These don't make sense but whatever, for testing purposes
        const body = {
            search: {
                providerCode: "ON-JC001",
                initial: "JC",
                date: "2024-12-34",
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsAdmin(adminToken, "/admin/getAdminSinglePrescriberPrescription", "POST", body);
        expect(res.status).toBe(200);
    
        let resBody = await res.json();
        expect(resBody.prescription.providerCode).toBe(body.search.providerCode);
        expect(resBody.prescription.date).toBe(body.search.date);
        expect(resBody.prescription.initial).toBe(body.search.initial);
        expect(resBody.prescription.prescribed).toBe(true);
        expect(resBody.prescription.status).toBe(PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED);
    })
    
    test("/admin/getAdminSinglePrescriberPrescription - not found prescriber prescription", async () => {
        await insertPrescriberPrescriptions(40);
    
        const body = {
            search: {
                providerCode: "ON-JC001",
                initial: "BC",
                date: "2024-12-69",
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsAdmin(adminToken, "/admin/getAdminSinglePrescriberPrescription", "POST", body);
        expect(res.status).toBe(404);
    })
});

describe("/admin/patchSinglePrescriberPrescription", () => {
    test("/admin/patchSinglePrescriberPrescription - no pa prescription, patches correct prescriber prescription", async () => {
        await insertPrescriberPrescription();
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": false,
            "status": PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
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
    
        // Get resulting list and search for the newly patched prescriber prescription
        res = await fetchAsAdmin(adminToken, "/admin/getAdminPaginatedPrescriberPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
    
        let resBody = await res.json();
        let retPrescriber = resBody.list[0];
        expect(resBody.list.length).toBe(1);
        expect(retPrescriber.providerCode).toBe(patches.providerCode);
        expect(retPrescriber.initial).toBe(patches.initial);
        expect(retPrescriber.date).toBe(patches.date);
        expect(retPrescriber.prescribed).toBe(patches.prescribed);
        expect(retPrescriber.status).toBe(patches.status);
    })
    
    test("/admin/patchSinglePrescriberPrescription - no pa prescription, invalid pr prescription status", async () => {
        await insertPrescriberPrescription();
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": true,
            "status": PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
        expect(res.status).toBe(404);
    })
    
    test("/admin/patchSinglePrescriberPrescription - no pa prescription, invalid pr prescription status", async () => {
        await insertPrescriberPrescription();
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": true,
            "status": PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
        expect(res.status).toBe(404);
    })
    
    test("/admin/patchSinglePrescriberPrescription - has pa prescription, invalid pr prescription status", async () => {
        await insertPrescriberPrescription({ status: PRESCRIBER_PRESCRIPTION_STATUS.LOGGED });
        await insertPatientPrescription({ status: PATIENT_PRESCRIPTION_STATUS.LOGGED });
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": true,
            "status": PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
        expect(res.status).toBe(404);
    })
    
    test("/admin/patchSinglePrescriberPrescription - has pa prescription, no need update corresponding pa prescription", async () => {
        await insertPrescriberPrescription({ status: PRESCRIBER_PRESCRIPTION_STATUS.LOGGED });
        await insertPatientPrescription({ status: PATIENT_PRESCRIPTION_STATUS.LOGGED });
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": true,
            "status": PRESCRIBER_PRESCRIPTION_STATUS.LOGGED
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
        expect(res.status).toBe(200);
    
        let getPageBody = {
            page: 1,
            pageSize: 20,
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
    
        // Get resulting list and search for the newly patched prescriber prescription
        res = await fetchAsAdmin(adminToken, "/admin/getAdminPaginatedPrescriberPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
    
        let resBody = await res.json();
        let retPrescriber = resBody.list[0];
        expect(resBody.list.length).toBe(1);
        expect(retPrescriber.providerCode).toBe(patches.providerCode);
        expect(retPrescriber.initial).toBe(patches.initial);
        expect(retPrescriber.date).toBe(patches.date);
        expect(retPrescriber.prescribed).toBe(patches.prescribed);
        expect(retPrescriber.status).toBe(patches.status);
    
        // Confirm corresponding patient prescription not changed
        // Assumes working getAdminSinglePatientPrescription
        getPageBody = {
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
        res = await fetchAsAdmin(adminToken, "/admin/getAdminSinglePatientPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        let retPatient = await res.json();
        expect(retPatient.prescription.providerCode).toBe(patches.providerCode);
        expect(retPatient.prescription.initial).toBe(patches.initial);
        expect(retPatient.prescription.date).toBe(patches.date);
        expect(retPatient.prescription.prescribed).toBe(patches.prescribed);
        expect(retPatient.prescription.status).toBe(PATIENT_PRESCRIPTION_STATUS.LOGGED);
    })
    
    test("/admin/patchSinglePrescriberPrescription - has pa prescription, update corresponding pa prescription complete", async () => {
        await insertPrescriberPrescription({ status: PRESCRIBER_PRESCRIPTION_STATUS.LOGGED });
        await insertPatientPrescription({ status: PATIENT_PRESCRIPTION_STATUS.LOGGED });
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": true,
            "status": PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
        expect(res.status).toBe(200);
    
        // Get resulting list and search for the newly patched prescriber prescription
        let getPageBody = {
            page: 1,
            pageSize: 20,
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
        res = await fetchAsAdmin(adminToken, "/admin/getAdminPaginatedPrescriberPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        let resBody = await res.json();
        let retPrescriber = resBody.list[0];
        expect(resBody.list.length).toBe(1);
        expect(retPrescriber.providerCode).toBe(patches.providerCode);
        expect(retPrescriber.initial).toBe(patches.initial);
        expect(retPrescriber.date).toBe(patches.date);
        expect(retPrescriber.prescribed).toBe(patches.prescribed);
        expect(retPrescriber.status).toBe(patches.status);
    
        // Confirm corresponding patient prescription updated
        // Assumes working getAdminPaginatedPatientPrescription
        getPageBody = {
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
        res = await fetchAsAdmin(adminToken, "/admin/getAdminSinglePatientPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        let retPatient = await res.json();
        expect(retPatient.prescription.providerCode).toBe(patches.providerCode);
        expect(retPatient.prescription.initial).toBe(patches.initial);
        expect(retPatient.prescription.date).toBe(patches.date);
        expect(retPatient.prescription.prescribed).toBe(patches.prescribed);
        expect(retPatient.prescription.status).toBe(PATIENT_PRESCRIPTION_STATUS.COMPLETE);
    })
    
    test("/admin/patchSinglePrescriberPrescription - has pa prescription, update corresponding pa prescription logged", async () => {
        await insertPrescriberPrescription({ status: PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE });
        await insertPatientPrescription({ status: PATIENT_PRESCRIPTION_STATUS.COMPLETE });
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": true,
            "status": PRESCRIBER_PRESCRIPTION_STATUS.LOGGED
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(adminToken, "/admin/patchSinglePrescriberPrescription", "PATCH", patchBody);
        expect(res.status).toBe(200);
    
        // Get resulting list and search for the newly patched prescriber prescription
        let getPageBody = {
            page: 1,
            pageSize: 20,
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
        res = await fetchAsAdmin(adminToken, "/admin/getAdminPaginatedPrescriberPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        let resBody = await res.json();
        let retPrescriber = resBody.list[0];
        expect(resBody.list.length).toBe(1);
        expect(retPrescriber.providerCode).toBe(patches.providerCode);
        expect(retPrescriber.initial).toBe(patches.initial);
        expect(retPrescriber.date).toBe(patches.date);
        expect(retPrescriber.prescribed).toBe(patches.prescribed);
        expect(retPrescriber.status).toBe(patches.status);
    
        // Confirm corresponding patient prescription updated
        // Assumes working getAdminSinglePatientPrescription
        getPageBody = {
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
        res = await fetchAsAdmin(adminToken, "/admin/getAdminSinglePatientPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        let retPatient = await res.json();
        expect(retPatient.prescription.providerCode).toBe(patches.providerCode);
        expect(retPatient.prescription.initial).toBe(patches.initial);
        expect(retPatient.prescription.date).toBe(patches.date);
        expect(retPatient.prescription.prescribed).toBe(patches.prescribed);
        expect(retPatient.prescription.status).toBe(PATIENT_PRESCRIPTION_STATUS.LOGGED);
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
});

describe("/admin/deletePrescriberPrescription", () => {
    test("/admin/deletePrescriberPrescription - delete valid prescriber prescription, update pa prescription", async () => {
        await insertPrescriberPrescription({ status: PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE });
        await insertPatientPrescription({ status: PATIENT_PRESCRIPTION_STATUS.COMPLETE });
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        // These don't make sense but whatever, for testing purposes
        let body = {
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsAdmin(adminToken, "/admin/deletePrescriberPrescription", "POST", body);
        expect(res.status).toBe(200);

        // Confirm corresponding patient prescription updated
        // Assumes working getAdminSinglePatientPrescription
        body = {
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
        res = await fetchAsAdmin(adminToken, "/admin/getAdminSinglePatientPrescription", "POST", body);
        expect(res.status).toBe(200);
        let retPatient = await res.json();
        expect(retPatient.prescription.providerCode).toBe(targetProviderCode);
        expect(retPatient.prescription.initial).toBe(targetInitial);
        expect(retPatient.prescription.date).toBe(targetDate);
        expect(retPatient.prescription.status).toBe(PATIENT_PRESCRIPTION_STATUS.NOT_LOGGED);
    })
    
    test("/admin/deletePrescriberPrescription - not found prescriber prescription", async () => {
        await insertPrescriberPrescriptions(40);
    
        const body = {
            search: {
                providerCode: "ON-JC001",
                initial: "BC",
                date: "2024-12-69",
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsAdmin(adminToken, "/admin/deletePrescriberPrescription", "POST", body);
        expect(res.status).toBe(404);
    })
});

/*
PATIENT PRESCRIPTIONS
*/

describe("/admin/getAdminSinglePatientPrescription", () => {
    test("/admin/getAdminSinglePatientPrescription - gets valid patient prescription", async () => {
        await insertPatientPrescriptions(40);
    
        // These don't make sense but whatever, for testing purposes
        const body = {
            search: {
                providerCode: "ON-JC0034",
                initial: "JC",
                date: "2024-12-34",
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsAdmin(adminToken, "/admin/getAdminSinglePatientPrescription", "POST", body);
        expect(res.status).toBe(200);
    
        let resBody = await res.json();
        expect(resBody.prescription.providerCode).toBe(body.search.providerCode);
        expect(resBody.prescription.date).toBe(body.search.date);
        expect(resBody.prescription.initial).toBe(body.search.initial);
        expect(resBody.prescription.prescribed).toBe(true);
        expect(resBody.prescription.email).toBe("patient1@gmail.com");
        expect(resBody.prescription.status).toBe(PATIENT_PRESCRIPTION_STATUS.NOT_LOGGED);
    })
    
    test("/admin/getAdminSinglePatientPrescription - not found patient prescription", async () => {
        await insertPatientPrescriptions(40);
    
        const body = {
            search: {
                providerCode: "ON-JC001",
                initial: "BC",
                date: "2024-12-69",
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            },
            thisFieldShouldBeIgnored: "AHHHHHHHHHH",
        }
        let res = await fetchAsAdmin(adminToken, "/admin/getAdminSinglePatientPrescription", "POST", body);
        expect(res.status).toBe(404);
    })
});
