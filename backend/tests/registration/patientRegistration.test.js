import { ACCOUNT_TYPE } from "../../types/userServiceTypes.js";
import { clearDB, closeConn, connect, insertAdmins, insertPatient, insertPrescriber } from "../utils/dbUtils.js";
import { genericPatient, genericPatient2, genericPrescriber, coordinator, assistant } from "../utils/sampleData.js"
import { SERVER } from "../../constants.js";

const SERVER_URL = `http://localhost:${SERVER.PORT}`

beforeAll(async () => {
    await connect();
})

beforeEach(async () => {
    // Clear db and generate some generic users
    await clearDB();
    await insertPatient();
})

afterAll(async () => {
    await closeConn();
})

test("/register/patient - new patient can register", async () => {
    let res = await fetch(`${SERVER_URL}/user/register/patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...genericPatient2,
            accountType: ACCOUNT_TYPE.PATIENT
        })
    })
    expect(res.status).toBe(200);

    let resBody = await res.json();
    expect(resBody.data.acknowledged).toBe(true);
});

test("/register/patient - existing patient can't register", async () => {
    let res = await fetch(`${SERVER_URL}/user/register/patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...genericPatient,
            accountType: ACCOUNT_TYPE.PATIENT
        })
    })
    expect(res.status).toBe(401);

    let resBody = await res.json();
    expect(resBody.error).toBe("Email already used");
});

test("/register/patient - missing accountType body element", async () => {
    let res = await fetch(`${SERVER_URL}/user/register/patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...genericPatient,
        })
    })
    expect(res.status).toBe(400);

    let resBody = await res.json();
    expect(resBody.error).toBe(`accountType is required.`);
});

test("/register/patient - perscriber can't register", async () => {
    let res = await fetch(`${SERVER_URL}/user/register/patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...genericPatient,
            accountType: ACCOUNT_TYPE.PRESCRIBER
        })
    })
    expect(res.status).toBe(400);

    let resBody = await res.json();
    expect(resBody.error).toBe("Account type is not Patient");
});

test("/register/patient - admin can't register", async () => {
    let res = await fetch(`${SERVER_URL}/user/register/patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...genericPatient,
            accountType: ACCOUNT_TYPE.ADMIN
        })
    })
    expect(res.status).toBe(400);

    let resBody = await res.json();
    expect(resBody.error).toBe("Account type is not Patient");
});

