import { connect, clearDB, insertAdmins, closeConn, insertPatients, insertPatientPrescriptions, insertPatientPrescription, insertPrescriberPrescription } from "../utils/dbUtils"
import { loginAsDefaultCoordinator } from "../utils/testSessionUtils"
import { fetchAsAdmin } from "../utils/fetchUtils";
import { PRESCRIBER_PRESCRIPTION_STATUS, PATIENT_PRESCRIPTION_STATUS } from "../../types/prescriptionTypes";
import { Patient } from "../../types/userServiceTypes";

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

describe("/coordinator/getCoordinatorPaginatedPatientPrescription", () => {
    test("/coordinator/getCoordinatorPaginatedPatientPrescription - gets all patients paginated Prescription", async () => {
        await insertPatientPrescriptions(40);
    
        for (let page = 1; page <= 2; page++) {
            const body = {
                page: page,
                pageSize: 20,
                search: {},
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            }
            let res = await fetchAsAdmin(coordToken, "/coordinator/getCoordinatorPaginatedPatientPrescription", "POST", body);
            expect(res.status).toBe(200);
    
            let resBody = await res.json();
            expect(resBody.list.length).toBe(20);
        }
    })

    test("/coordinator/getCoordinatorPaginatedPatientPrescription - no results", async () => {
        await insertPatientPrescriptions(40);
    
        const searchProviderCode = "Should not find anything";
    
        for (let page = 1; page <= 2; page++) {
            const body = {
                page: page,
                pageSize: 20,
                search: { providerCode: searchProviderCode },
                thisFieldShouldBeIgnored: "AHHHHHHHHHH",
            }
            let res = await fetchAsAdmin(coordToken, "/coordinator/getCoordinatorPaginatedPatientPrescription", "POST", body);
            expect(res.status).toBe(200);
    
            let resBody = await res.json();
            expect(resBody.list.length).toBe(0);
        }
    })
})

describe("/coordinator/patchSinglePatientPrescription", () => {
    test("/coordinator/patchSinglePatientPrescription - no pr prescription, patches correct patient prescription", async () => {
        await insertPatientPrescription();
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": false,
            "status": PATIENT_PRESCRIPTION_STATUS.NOT_LOGGED
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
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
    
        // Get resulting list and search for the newly patched patient prescription
        res = await fetchAsAdmin(coordToken, "/coordinator/getCoordinatorPaginatedPatientPrescription", "POST", getPageBody);
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

    test("/coordinator/patchSinglePatientPrescription - no pr prescription, invalid pa prescription status", async () => {
        await insertPatientPrescription();
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": true,
            "status": PATIENT_PRESCRIPTION_STATUS.COMPLETE
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
        expect(res.status).toBe(404);
    })
    
    test("/coordinator/patchSinglePatientPrescription - no pr prescription, invalid pa prescription status", async () => {
        await insertPatientPrescription();
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "JC";
        const targetDate = "2024-12-34";
        const patches = {
            "providerCode": targetProviderCode,
            "initial": targetInitial,
            "date": targetDate,
            "prescribed": true,
            "status": PATIENT_PRESCRIPTION_STATUS.COMPLETE
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
        expect(res.status).toBe(404);
    })

    test("/coordinator/patchSinglePatientPrescription - has pr prescription, invalid pa prescription status", async () => {
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
            "status": PATIENT_PRESCRIPTION_STATUS.NOT_LOGGED
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
        expect(res.status).toBe(404);
    })

    test("/coordinator/patchSinglePatientPrescription - has pr prescription, no need update corresponding pa prescription", async () => {
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
            "status": PATIENT_PRESCRIPTION_STATUS.LOGGED
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
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
    
        // Get resulting list and search for the newly patched patient prescription
        res = await fetchAsAdmin(coordToken, "/coordinator/getCoordinatorPaginatedPatientPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
    
        let resBody = await res.json();
        let retPrescriber = resBody.list[0];
        expect(resBody.list.length).toBe(1);
        expect(retPrescriber.providerCode).toBe(patches.providerCode);
        expect(retPrescriber.initial).toBe(patches.initial);
        expect(retPrescriber.date).toBe(patches.date);
        expect(retPrescriber.prescribed).toBe(patches.prescribed);
        expect(retPrescriber.status).toBe(patches.status);
    
        // Confirm corresponding prescriber prescription not changed
        // Assumes working getAdminSinglePrescriberPrescription
        getPageBody = {
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
        res = await fetchAsAdmin(coordToken, "/admin/getAdminSinglePrescriberPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        let retPatient = await res.json();
        expect(retPatient.prescription.providerCode).toBe(patches.providerCode);
        expect(retPatient.prescription.initial).toBe(patches.initial);
        expect(retPatient.prescription.date).toBe(patches.date);
        expect(retPatient.prescription.prescribed).toBe(patches.prescribed);
        expect(retPatient.prescription.status).toBe(PRESCRIBER_PRESCRIPTION_STATUS.LOGGED);
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
            "status": PATIENT_PRESCRIPTION_STATUS.COMPLETE
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
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
        res = await fetchAsAdmin(coordToken, "/coordinator/getCoordinatorPaginatedPatientPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        let resBody = await res.json();
        let ret = resBody.list[0];
        expect(resBody.list.length).toBe(1);
        expect(ret.providerCode).toBe(patches.providerCode);
        expect(ret.initial).toBe(patches.initial);
        expect(ret.date).toBe(patches.date);
        expect(ret.prescribed).toBe(patches.prescribed);
        expect(ret.status).toBe(patches.status);
    
        // Confirm corresponding prescriber prescription not changed
        // Assumes working getAdminSinglePrescriberPrescription
        getPageBody = {
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
        res = await fetchAsAdmin(coordToken, "/admin/getAdminSinglePrescriberPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        ret = await res.json();
        expect(ret.prescription.providerCode).toBe(patches.providerCode);
        expect(ret.prescription.initial).toBe(patches.initial);
        expect(ret.prescription.date).toBe(patches.date);
        expect(ret.prescription.prescribed).toBe(patches.prescribed);
        expect(ret.prescription.status).toBe(PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE);
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
            "status": PATIENT_PRESCRIPTION_STATUS.LOGGED
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber prescription
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
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
        res = await fetchAsAdmin(coordToken, "/coordinator/getCoordinatorPaginatedPatientPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        let resBody = await res.json();
        let ret = resBody.list[0];
        expect(resBody.list.length).toBe(1);
        expect(ret.providerCode).toBe(patches.providerCode);
        expect(ret.initial).toBe(patches.initial);
        expect(ret.date).toBe(patches.date);
        expect(ret.prescribed).toBe(patches.prescribed);
        expect(ret.status).toBe(patches.status);
    
        // Confirm corresponding prescriber prescription not changed
        // Assumes working getAdminSinglePrescriberPrescription
        getPageBody = {
            search: {
                providerCode: targetProviderCode,
                initial: targetInitial,
                date: targetDate,
            }
        }
        res = await fetchAsAdmin(coordToken, "/admin/getAdminSinglePrescriberPrescription", "POST", getPageBody);
        expect(res.status).toBe(200);
        ret = await res.json();
        expect(ret.prescription.providerCode).toBe(patches.providerCode);
        expect(ret.prescription.initial).toBe(patches.initial);
        expect(ret.prescription.date).toBe(patches.date);
        expect(ret.prescription.prescribed).toBe(patches.prescribed);
        expect(ret.prescription.status).toBe(PRESCRIBER_PRESCRIPTION_STATUS.LOGGED);
    })

    test("/coordinator/patchSinglePatientPrescription - invalid patch body, null fields", async () => {
        await insertPatientPrescriptions(20);
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = null;
        const targetDate = "2024-12-10";
        const patches = {
            "prescribed": true,
            "status": PATIENT_PRESCRIPTION_STATUS.COMPLETE
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch patient
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
        expect(res.status).toBe(400);
    })
    
    test("/coordinator/patchSinglePatientPrescription - invalid patch body, empty fields", async () => {
        await insertPatientPrescriptions(20);
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "";
        const targetDate = "";
        const patches = {
            "prescribed": true,
            "status": PATIENT_PRESCRIPTION_STATUS.COMPLETE
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
        expect(res.status).toBe(400);
    })
    
    test("/admin/patchSinglePrescriberPrescription - fails to find prescriber prescription", async () => {
        await insertPatientPrescriptions(20);
    
        const targetProviderCode = "ON-JC001";
        const targetInitial = "GG";
        const targetDate = "2024-12-69";
        const patches = {
            "prescribed": true,
            "status": PATIENT_PRESCRIPTION_STATUS.COMPLETE
        }
        const patchBody = {
            providerCode: targetProviderCode,
            initial: targetInitial,
            date: targetDate,
            patches: patches
        }
    
        // Patch prescriber
        let res = await fetchAsAdmin(coordToken, "/coordinator/patchSinglePatientPrescription", "PATCH", patchBody);
        expect(res.status).toBe(404);
    })
})

describe("/coordinator/deletePatientPrescription", () => {
    test("/coordinator/deletePatientPrescription - delete valid patient prescription, update pr prescription", async () => {
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
        let res = await fetchAsAdmin(coordToken, "/coordinator/deletePatientPrescription", "POST", body);
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
        res = await fetchAsAdmin(coordToken, "/admin/getAdminSinglePrescriberPrescription", "POST", body);
        expect(res.status).toBe(200);
        let ret = await res.json();
        expect(ret.prescription.providerCode).toBe(targetProviderCode);
        expect(ret.prescription.initial).toBe(targetInitial);
        expect(ret.prescription.date).toBe(targetDate);
        expect(ret.prescription.status).toBe(PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED);
    })
    
    test("/coordinator/deletePatientPrescription - not found patient prescription", async () => {
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
        let res = await fetchAsAdmin(coordToken, "/coordinator/deletePatientPrescription", "POST", body);
        expect(res.status).toBe(404);
    })
});
