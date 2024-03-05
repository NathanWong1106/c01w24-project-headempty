export const ACCOUNT_TYPE = {
    ADMIN: "admin",
    COORDINATOR: "coordinator",
    ASSISTANT: "assistant",
    PRESCRIBER: "prescriber",
    PATIENT: "patient"
}

class User {
    constructor(accountType, email, token) {
        this.accountType = accountType;
        this.email = email;
        this.token = token;
    }
}

class ClientUser extends User {
    constructor(accountType, email, token, firstName, lastName, language, city, province, address) {
        super(accountType, email, token);
        this.firstName = firstName;
        this.lastName = lastName;
        this.language = language;
        this.city = city;
        this.province = province;
        this.address = address;
    }
}

export class Admin extends User {
    constructor(accountType, email, token) {
        super(accountType, email, token);
    }
}

export class Patient extends ClientUser {
    constructor(email, token, firstName, lastName, language, city, province, address) {
        super(ACCOUNT_TYPE.PATIENT, email, token, firstName, lastName, language, city, province, address);
    }
}

export class Prescriber extends ClientUser {
    constructor(email, token, firstName, lastName, language, city, province, address, profession, providerCode, licencingCollege, licenceNumber, registered) {
        super(ACCOUNT_TYPE.PRESCRIBER, email, token, firstName, lastName, language, city, province, address);
        this.profession = profession;
        this.providerCode = providerCode;
        this.licencingCollege = licencingCollege;
        this.licenceNumber = licenceNumber;
        this.registered = registered;
    }
}