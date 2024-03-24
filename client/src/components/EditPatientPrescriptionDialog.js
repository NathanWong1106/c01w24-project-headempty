import { useState } from "react";
import { prescriptionFields, prescriptionField2PrescriptionInfo, PatientPrescription, PATIENT_PRESCRIPTION_STATUS } from "../apiServices/types/prescriptionTypes";
import { getAdminSinglePrescriberPrescription } from "../apiServices/adminService";
import { BaseEditPrescriptionDialog } from "./BaseEditPrescriptionDialog";
import { patchPatientPrescription } from "../apiServices/coordinatorService";


/**
 * Opens the edit dialog for the specified patient.
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
            const [prescribed] = fieldMapping["Prescribed with Discovery Pass"];
            const correspondingPaPrescription = await getAdminSinglePrescriberPrescription({
                providerCode: providerCode,
                initial: initial,
                date: date,
            });
            if (!correspondingPaPrescription) {
                return [PATIENT_PRESCRIPTION_STATUS.NOT_LOGGED];
            }
            else {
                if (prescribed) {
                    return [
                        PATIENT_PRESCRIPTION_STATUS.LOGGED,
                        PATIENT_PRESCRIPTION_STATUS.COMPLETE_WITH_DISCOVERY_PASS,
                    ]
                }
                return [PATIENT_PRESCRIPTION_STATUS.COMPLETE];
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