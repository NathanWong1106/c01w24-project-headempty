import { ACCOUNT_TYPE } from "../../types/userServiceTypes";
import { assistant, genericPatient, genericPrescriber, clearDB, closeConn, connect, coordinator, insertAdmins, insertPatient, insertPrescriber } from "../utils/dbUtils";

const SERVER_URL = "http://localhost:4000";

beforeAll(async () => {
    await connect();
})

beforeEach(async () => {
    // Clear db and generate some generic users
    await clearDB();
    await insertAdmins();
    await insertPatient();
    await insertPrescriber();
})

afterAll(async () => {
    await closeConn();
})

test("/user/login - admins can log in", async () => {
    // Try logging in coordinator
    let res = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...coordinator,
            accountType: ACCOUNT_TYPE.ADMIN
        })
    })
    expect(res.status).toBe(200);

    let resBody = await res.json();
    expect(resBody.email).toBe(coordinator.email);
    expect(resBody.accountType).toBe(ACCOUNT_TYPE.COORDINATOR);

    // Try logging in assistant
    res = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...assistant,
            accountType: ACCOUNT_TYPE.ADMIN
        })
    })
    expect(res.status).toBe(200);

    resBody = await res.json();
    expect(resBody.email).toBe(assistant.email);
    expect(resBody.accountType).toBe(ACCOUNT_TYPE.ASSISTANT);
});

test("/user/login - patients can log in", async () => {
    let res = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...genericPatient,
            accountType: ACCOUNT_TYPE.PATIENT
        })
    })
    expect(res.status).toBe(200);

    let resBody = await res.json();
    expect(resBody.email).toBe(genericPatient.email);
    expect(resBody.accountType).toBe(ACCOUNT_TYPE.PATIENT);
});

test("/user/login - prescribers can log in", async () => {
    let res = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...genericPrescriber,
            accountType: ACCOUNT_TYPE.PRESCRIBER
        })
    })
    expect(res.status).toBe(200);

    let resBody = await res.json();
    expect(resBody.email).toBe(genericPrescriber.email);
    expect(resBody.accountType).toBe(ACCOUNT_TYPE.PRESCRIBER);
});

test("/user/login - rejects unidentified user", async () => {
    let res = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...genericPrescriber,
            accountType: ACCOUNT_TYPE.PRESCRIBER,
            password: "this shouldn't be used as a password"
        })
    })
    expect(res.status).toBe(401);
});