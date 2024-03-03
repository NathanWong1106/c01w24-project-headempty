import { ACCOUNT_TYPE } from "../../types/userServiceTypes.js";

export const defaultPassword = "1234";

export const coordinator = {
    "email": "parxadmin@gmail.com",
    "password": defaultPassword,
    "accountType": ACCOUNT_TYPE.COORDINATOR
};

export const assistant = {
    "email": "parxassistant@gmail.com",
    "password": defaultPassword,
    "accountType": ACCOUNT_TYPE.ASSISTANT
};

export const genericPatient = {
    "email": "patient1@gmail.com",
    "password": defaultPassword,
    "firstName": "John",
    "lastName": "Cena",
    "language": "en",
    "city": "Toronto",
    "province": "ON",
    "address": "1254 Military Trail"
};

export const genericPrescriber = {
    "licensingCollege": "licensing college",
    "licenseNumber": "license number 1234",
    "profession": "therapist",
    "providerCode": "ON-JC001",
    "email": "prescriber1@gmail.com",
    "password": defaultPassword,
    "firstName": "John",
    "lastName": "Cena",
    "language": "en",
    "city": "Toronto",
    "province": "ON",
    "address": "1254 Military Trail",
    "registered": true
};