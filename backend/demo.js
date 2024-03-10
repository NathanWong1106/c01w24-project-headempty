import { ACCOUNT_TYPE } from "./types/userServiceTypes.js";
import { db, clearDB, closeConn, connect, insertAdmins, insertPatient, insertPrescriber } from "./tests/utils/dbUtils.js";
import { genericPatient, genericPrescriber, coordinator, assistant } from "./tests/utils/sampleData.js"
import { SERVER } from "./constants.js";
import { getPrescriberFromCollectionWithId, tryRegisterPrescriber } from "./database/userServiceDbUtils.js"
import { ObjectId } from "mongodb";

const SERVER_URL = `http://localhost:${SERVER.PORT}`

//65ecdb27eb252dd6c9f46343

await connect();
/*let res = await fetch(`${SERVER_URL}/user/registration/prescriber/65ecdb27eb252dd6c9f46`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    }
})
let resBody = await res.json();
console.log(resBody);*/

//await insertPrescriber();

clearDB();

await closeConn();