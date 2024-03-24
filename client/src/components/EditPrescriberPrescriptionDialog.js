import { useState } from "react";
import { PrescriberPrescription, prescriptionFields, prescriptionField2PrescriptionInfo, PRESCRIBER_PRESCRIPTION_STATUS } from "../apiServices/types/prescriptionTypes";
import { getAdminSinglePatientPrescription, patchPrescriberPrescription } from "../apiServices/adminService";
import { BaseEditPrescriptionDialog } from "./BaseEditPrescriptionDialog";


/**
 * Opens the edit dialog for the specified prescriber.
 * 
 * @param {{prescription: PrescriberPrescription}} props
 */
export const EditPrescriberPrescriptionDialog = ({ prescription }) => {

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
            const correspondingPaPrescription = await getAdminSinglePatientPrescription({
                providerCode: providerCode,
                initial: initial,
                date: date,
            });
            if (!correspondingPaPrescription) {
                return [PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED];
            }
            else {
                if (prescribed) {
                    return [
                        PRESCRIBER_PRESCRIPTION_STATUS.LOGGED,
                        PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE_WITH_DISCOVERY_PASS,
                    ]
                }
                return [PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE];
            }
        } catch (err) {
            return [];
        }
    }

    return (
        <BaseEditPrescriptionDialog
            prescription={prescription}
            fieldMapping={fieldMapping}
            prescriptionField2InfoMapping={prescriptionField2PrescriptionInfo}
            textInputFields={["Provider Code", "Date", "Patient Initials"]}
            getStatusOptions={getStatusOptions}
            patchPrescription={patchPrescriberPrescription}
        />
    );
}