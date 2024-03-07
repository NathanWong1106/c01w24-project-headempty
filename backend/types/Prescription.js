const COMMON_STATUS = {
    COMPLETE: "Complete",
    COMPLETE_WITH_DISCOVERY_PASS: "Complete with Discovery Pass"
}

export const PATIENT_PRESCRIPTION_STATUS = {
    ...COMMON_STATUS,
    NOT_LOGGED: "Pr not logged yet",
    LOGGED: "Pr logged"
}

export const PRESCRIBER_PRESCRIPTION_STATUS = {
    ...COMMON_STATUS,
    NOT_LOGGED: "Pa not logged yet",
    LOGGED: "Pa logged"
}


class LogPrescription {
    constructor(providerCode, date, initial, prescribed, status) {
        this.providerCode = providerCode;
        this.date = date;
        this.initial = initial;
        this.prescribed = prescribed;
        this.status = status;
    }
}

export class PrescriberPrescription extends LogPrescription {
    constructor(providerCode, date, initial, prescribed, status) {
        super(providerCode, date, initial, prescribed, status || PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED);
    }
}

export class PatientPrescription extends LogPrescription {
    constructor(providerCode, date, initial, prescribed, status) {
        super(providerCode, date, initial, prescribed, status || PATIENT_PRESCRIPTION_STATUS.NOT_LOGGED);
    }
}