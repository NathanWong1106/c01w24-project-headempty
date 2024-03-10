import { ACCOUNT_TYPE } from "../../types/userServiceTypes.js";
import { clearDB, closeConn, connect, findPrescriberId, insertAdmins, insertPatient, insertPrescriber } from "../utils/dbUtils.js";
import { genericPatient, genericPrescriber, coordinator, assistant } from "../utils/sampleData.js"
import { SERVER } from "../../constants.js";

const SERVER_URL = `http://localhost:${SERVER.PORT}`

beforeAll(async () => {
    await connect();
})

beforeEach(async () => {
    await clearDB();
})

afterAll(async () => {
    await clearDB();
    await closeConn();
})

test("/user/registration/:prescriberID - checks if verified prescriber eligible for registration", async () => {
    let prescriber = await insertPrescriber({"registered": false});
    let id = await findPrescriberId(prescriber);
    
    let res = await fetch(`${SERVER_URL}/user/registration/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    expect(res.status).toBe(200);
    let resBody = await res.json();
    expect(resBody.email).toBe(prescriber.email);
    expect(resBody.providerCode).toBe(prescriber.providerCode);
    expect(resBody.licenceNumber).toBe(prescriber.licenceNumber);
});

test("/user/registration/:prescriberID - checks if already registered prescriber eligible for registration", async () => {
    let prescriber = await insertPrescriber();
    let id = await findPrescriberId(prescriber);
    
    let res = await fetch(`${SERVER_URL}/user/registration/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    expect(res.status).toBe(402);
    let resBody = await res.json();
    expect(resBody.error).toBe("The prescriber associated with this link has already been registered.");
});

test("/user/registration/:prescriberID - check if invalid id can be registered", async () => {
    let res = await fetch(`${SERVER_URL}/user/registration/asdsakdhjkasdasd`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    expect(res.status).toBe(400);
    let resBody = await res.json();
    expect(resBody.error).toBe("This is not a valid registration link.");
});

test("/user/registration/prescriber - actually register prescriber", async () => {
    let prescriber = await insertPrescriber();
    let _id = await findPrescriberId(prescriber);
    let res = await fetch(`${SERVER_URL}/user/registration/prescriber`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _id: _id,
            password: "dorwssap",
            language: "yapology"
        })
    })
    expect(res.status).toBe(200);
    let resBody = await res.json();
    expect(resBody.modifiedCount).toBe(1);
});

test("/user/registration/prescriber - check if all fields are there", async () => {
    let res = await fetch(`${SERVER_URL}/user/registration/prescriber`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password: "dorwssap"
        })
    })
    expect(res.status).toBe(400);
    let resBody = await res.json();
    expect(resBody.error).toBe("Please fill out all fields");

    res = await fetch(`${SERVER_URL}/user/registration/prescriber`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            language: "yapology"
        })
    })
    expect(res.status).toBe(400);
    resBody = await res.json();
    expect(resBody.error).toBe("Please fill out all fields");
});

test("/user/registration/prescriber - check if id is valid", async () => {
    let res = await fetch(`${SERVER_URL}/user/registration/prescriber`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _id: "dsfhjks",
            password: "dorwssap",
            language: "yapology"
        })
    })
    expect(res.status).toBe(401);
    let resBody = await res.json();
    expect(resBody.error).toBe("This is not a verified prescriber.");
});




