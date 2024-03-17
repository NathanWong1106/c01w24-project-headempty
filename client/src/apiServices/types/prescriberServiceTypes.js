import { checkbox } from "@material-tailwind/react";

class PrescriptionInfo {
    constructor(prescriptionDate, pateintInitials, discoveryPass, prescriptionStatus, providerCode, prescriberEmail, description) {
        this.prescriptionDate = prescriptionDate;
        this.pateintInitials = pateintInitials;
        this.discoveryPass = discoveryPass;
        this.prescriptionStatus = prescriptionStatus;
        this.providerCode = providerCode;
        this.prescriberEmail = prescriberEmail;
        this.description = description;
    }
}

//field names that need to be displayed in table based on the doc requirements
export const visiblePrescFields = ["Prescription Date", "Patient Initials", "Discovery Pass", "Prescription Status"] 
// field names for users 
export const prescriptionFields = ["Prescription Date", "Patient Initials", "Provider Code", "Prescriber Email", "Description", "Prescribe Discovery Pass"];


// mapping of field names 
export const prescriptionField2PrescriptionInfo = {
    "Prescription Date": ["prescriptionDate", "date"],
    "Patient Initials": ["pateintInitials", "text"],
    "Prescription Status": ["prescriptionStatus", "text"],
    "Provider Code": ["providerCode", "text"],
    "Prescriber Email": ["prescriberEmail", "email"],
    "Description": ["description", "text"],
    "Prescribe Discovery Pass": ["discoveryPass", "checkbox"]
    
}


export default PrescriptionInfo;
