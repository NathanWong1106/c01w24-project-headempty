import { useState } from "react";
import { PrescriberPrescription, prescriptionFields, prescriptionField2PrescriptionInfo, PRESCRIBER_PRESCRIPTION_STATUS, PatientPrescription, PATIENT_PRESCRIPTION_STATUS } from "../apiServices/types/prescriptionTypes";
import { getAdminSinglePatientPrescription, getAdminSinglePrescriberPrescription, patchPrescriberPrescription } from "../apiServices/adminService";
import { BaseEditPrescriptionDialog } from "./BaseEditPrescriptionDialog";
import { patchPatientPrescription } from "../apiServices/coordinatorService";


/**
 * Opens the edit dialog for the specified prescriber.
 * 
 * @param {{prescription: PatientPrescription}} props
 */
export const EditPatientPrescriptionDialog = ({ prescription }) => {

    // Set up a mapping of relevant fields
    const fieldMapping = {};
    prescriptionFields.forEach(field => {
        fieldMapping[field] = useState(prescription[prescriptionField2PrescriptionInfo[field]]);
    })

    const getStatusOptions = async () => {
        // Uses the state for dynamic update in case these are modified
        try {
            let [providerCode] = fieldMapping["Provider Code"];
            let [initial] = fieldMapping["Patient Initials"];
            let [date] = fieldMapping["Date"];
            const correspondingPaPrescription = await getAdminSinglePrescriberPrescription({
                providerCode: providerCode,
                initial: initial,
                date: date,
            });
            if (!correspondingPaPrescription) {
                return [PATIENT_PRESCRIPTION_STATUS.NOT_LOGGED];
            }
            else {
                return [
                    PATIENT_PRESCRIPTION_STATUS.LOGGED,
                    PATIENT_PRESCRIPTION_STATUS.COMPLETE,
                    PATIENT_PRESCRIPTION_STATUS.COMPLETE_WITH_DISCOVERY_PASS,
                ];
            }
        } catch (err) {
            return [];
        }
    }

    return (
        <BaseEditPrescriptionDialog
            prescription={prescription}
            fieldMapping={fieldMapping}
            textInputFields={["Provider Code", "Date", "Patient Initials"]}
            getStatusOptions={getStatusOptions}
            patchPrescription={patchPatientPrescription}
        />
    );
}