const COMMON_STATUS = {
    COMPLETE: "Complete",
    COMPLETE_WITH_DISCOVERY_PASS: "Complete with Discovery Pass"
}

export const PATIENT_FORM_STATUS = {
    ...COMMON_STATUS,
    NOT_LOGGED: "Pr not logged yet",
    LOGGED: "Pr logged"
}

export const PRESCRIBER_FORM_STATUS = {
    ...COMMON_STATUS,
    NOT_LOGGED: "Pa not logged yet",
    LOGGED: "Pa logged"
}


class LogForm {
    constructor(providerCode, date, initial, prescribed, status) {
        this.providerCode = providerCode;
        this.date = date;
        this.initial = initial;
        this.prescribed = prescribed;
        this.status = status;
    }
}

export class PrescriberForm extends LogForm {
    constructor(providerCode, date, initial, prescribed, status) {
        super(providerCode, date, initial, prescribed, status || PRESCRIBER_FORM_STATUS.NOT_LOGGED);
    }
}

export class PatientForm extends LogForm {
    constructor(providerCode, date, initial, prescribed, status) {
        super(providerCode, date, initial, prescribed, status || PATIENT_FORM_STATUS.NOT_LOGGED);
    }
}