class ClientUserInfo {
    constructor(email, firstName, lastName, language, city, province, address) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.language = language;
        this.city = city;
        this.province = province;
        this.address = address;
    }
}

/**
 * Currently unused. Used to implement coordinator (shouldn't be used by assistant) patient stuff later.
 */
export class PatientInfo extends ClientUserInfo {
    constructor(email, firstName, lastName, language, city, province, address) {
        super(email, firstName, lastName, language, city, province, address);
    }
}

/**
 * All necessary information for a single prescriber.
 */
export class PrescriberInfo extends ClientUserInfo {
    constructor(email, firstName, lastName, language, city, province, address, profession, providerCode, licensingCollege, licenceNumber, registered) {
        super(email, firstName, lastName, language, city, province, address);
        this.profession = profession;
        this.providerCode = providerCode;
        this.licensingCollege = licensingCollege;
        this.licenceNumber = licenceNumber;
        this.registered = registered;
    }
}

/* User friendly field names (use in table header) */
export const prescriberFields = ["Email", "First Name", "Last Name", "Language", "City", "Province", "Address", "Profession", "Provider Code", "Licensing College", "Licence Number", "Registered"]

/* Map the above user friendly names to actual field names */
export const prescriberField2PrescriberInfo = {
    "Email": "email",
    "First Name": "firstName",
    "Last Name": "lastName",
    "Language": "language",
    "City": "city",
    "Province": "province",
    "Address": "address",
    "Profession": "profession",
    "Provider Code": "providerCode",
    "Licensing College": "licensingCollege",
    "Licence Number": "licenceNumber",
    "Registered": "registered"
}