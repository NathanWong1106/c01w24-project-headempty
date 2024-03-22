import { checkbox } from "@material-tailwind/react";

class PrescriptionInfo {
    constructor(prescriptionDate, pateintInitials, discoveryPass, prescriptionStatus, providerCode, description) {
        this.prescriptionDate = prescriptionDate;
        this.pateintInitials = pateintInitials;
        this.discoveryPass = discoveryPass;
        this.prescriptionStatus = prescriptionStatus;
        this.providerCode = providerCode;
        this.description = description;
    }
}

//field names that need to be displayed in table based on the doc requirements
export const visiblePrescFields = ["Prescription Date", "Patient Initials", "Discovery Pass", "Prescription Status"] 
// field names for users 
export const prescriptionFields = ["Provider Code", "Prescription Date", "Patient Initials", "Description", "Prescribe Discovery Pass", "Prescription Status"];


// mapping of field names 
export const prescriptionField2PrescriptionInfo = {
    "Provider Code": ["providerCode", "text"],
    "Prescription Date": ["prescriptionDate", "date"],
    "Patient Initials": ["pateintInitials", "text"],
    "Description": ["description", "text"],
    "Prescribe Discovery Pass": ["discoveryPass", "checkbox"],
    "Prescription Status": ["prescriptionStatus", "text"]
    
}


export default PrescriptionInfo;
