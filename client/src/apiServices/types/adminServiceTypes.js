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
 * All necessary information for a Patient. (Used by coordinator)
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
    constructor(id, email, firstName, lastName, language, city, province, address, profession, providerCode, licensingCollege, licenceNumber, registered) {
        super(email, firstName, lastName, language, city, province, address);
        this.id = id;
        this.profession = profession;
        this.providerCode = providerCode;
        this.licensingCollege = licensingCollege;
        this.licenceNumber = licenceNumber;
        this.registered = registered;
        this.registrationLink = `/register/${id}`;
    }
}

/* User friendly field names (use in table header) */
export const prescriberFields = ["Email", "First Name", "Last Name", "Language", "City", "Province", "Address", "Profession", "Provider Code", "Licensing College", "Licence Number", "Registered", "Registration Link"]
export const prescriberPatchFields = ["Email", "First Name", "Last Name", "Language", "City", "Province", "Address", "Profession", "Licensing College", "Licence Number"]

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
    "Registered": "registered",
    "Registration Link": "registrationLink"
}

export const patientFields = ["Email", "First Name", "Last Name", "Language", "City", "Province", "Address"]
export const patientPatchFields = ["First Name", "Last Name", "Language", "City", "Province", "Address"]
export const patientField2PatientInfo = {
    "Email": "email",
    "First Name": "firstName",
    "Last Name": "lastName",
    "Language": "language",
    "City": "city",
    "Province": "province",
    "Address": "address"
}