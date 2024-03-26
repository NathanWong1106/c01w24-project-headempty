import { PRESCRIBER_PRESCRIPTION_STATUS, PATIENT_PRESCRIPTION_STATUS } from "../../types/prescriptionTypes.js";
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
    "initials": "JC",
    "language": "en",
    "city": "Toronto",
    "province": "ON",
    "address": "1254 Military Trail"
};

export const genericPatient2 = {
    "email": "patient2@gmail.com",
    "password": defaultPassword,
    "firstName": "Silly",
    "lastName": "Billy",
    "initials": "SB",
    "language": "en",
    "city": "Toronto",
    "province": "ON",
    "address": "1254 Military Trail"
};

export const genericPrescriber = {
    "licensingCollege": "licensing college",
    "licenceNumber": "licence number 1234",
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

export const genericPrescriberPrescription = {
    "providerCode": "ON-JC001",
    "date": "2024-12-34",
    "initial": "JC",
    "prescribed": true,
    "status": PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED
};

export const genericPatientPrescription = {
    "providerCode": "ON-JC001",
    "date": "2024-12-34",
    "initial": "JC",
    "prescribed": true,
    "email": "patient1@gmail.com",
    "status": PATIENT_PRESCRIPTION_STATUS.NOT_LOGGED
};